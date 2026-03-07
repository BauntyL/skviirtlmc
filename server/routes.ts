import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";

import { users, clans, serverStats, authCodes } from "@shared/schema";
import { eq, sql, and, gt, or } from "drizzle-orm";
import { db } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (moved from storage.ts to avoid circular dependency/import issues with MemStorage)
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "skviirtl_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: false, // Выключаем secure, пока нет HTTPS
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
      },
    })
  );

  // === PLUGIN API ===
  app.post("/api/plugin/handler", async (req, res) => {
    // Basic API Key check
    const body = req.body || {};
    const query = req.query || {};
    
    const apiKey = body.secret || query.secret;
    const validKey = process.env.API_KEY || "skviirtl_secret_key_123";

    if (!apiKey || apiKey !== validKey) {
        return res.status(403).json({ message: 'Invalid API Key' });
    }

    const action = query.action || body.action;

    try {
      // === AUTH CODE (Save code from plugin) ===
      if (action === 'auth-code') {
          const username = body.username;
          const code = body.code;
          if (!username || !code) return res.status(400).json({ message: 'Missing fields' });

          await db.delete(authCodes).where(eq(authCodes.username, username));
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
          await db.insert(authCodes).values({ username, code, expiresAt });
          return res.status(200).json({ success: true });
      }

      // === VERIFY CODE (Link account) ===
      if (action === 'verify-code') {
          const username = body.username;
          const code = body.code;
          const uuid = body.uuid;
          if (!username || !code) return res.status(400).json({ message: 'Missing fields' });

          const now = new Date().toISOString();
          const foundCodes = await db.select().from(authCodes)
              .where(and(eq(authCodes.code, code), gt(authCodes.expiresAt, now)));

          if (foundCodes.length === 0) return res.status(404).json({ message: "Invalid or expired code" });
          const authCode = foundCodes[0];
          
          // Linking requires a userId in the code (generated from site)
          if (!authCode.userId) return res.status(400).json({ message: "Code not linked to user" });

          const existingUser = await db.select().from(users).where(eq(users.username, username));
          const canUpdateUsername = existingUser.length === 0 || existingUser[0].id === authCode.userId;

          const updateData: any = {
              minecraftUuid: uuid || null,
          };

          if (canUpdateUsername) {
              updateData.username = username;
          }

          await db.update(users)
              .set(updateData)
              .where(eq(users.id, authCode.userId));
          
          await db.delete(authCodes).where(eq(authCodes.id, authCode.id));
          return res.status(200).json({ success: true });
      }

      // === SYNC (Main sync logic) ===
      if (!action || action === 'sync') {
          const { onlineCount, maxPlayers, tps, players, clans: clansList } = body;

          // Update Server Stats
          if (onlineCount !== undefined) {
              const existingStats = await db.select().from(serverStats).where(eq(serverStats.id, 1));
              if (existingStats.length === 0) {
                  await db.insert(serverStats).values({ id: 1, onlineCount, maxPlayers, tps });
              } else {
                  await db.update(serverStats).set({ onlineCount, maxPlayers, tps }).where(eq(serverStats.id, 1));
              }
          }

          // Update Players
          if (Array.isArray(players)) {
              for (const p of players) {
                  // Clan Auto-Create
                  if (p.clan) {
                      const clanName = p.clan.replace(/[\[\]]/g, "");
                      if (clanName) {
                          const existingClans = await db.select().from(clans).where(eq(clans.name, clanName));
                          if (existingClans.length === 0) {
                              await db.insert(clans).values({
                                  name: clanName,
                                  leader: (p.clanRank && ['leader', 'лидер', 'owner', 'владелец'].includes(p.clanRank.toLowerCase())) ? p.name : "Unknown",
                                  membersCount: 1,
                                  rank: 0,
                                  balance: p.clanBalance ? p.clanBalance.toString() : "0",
                                  kdr: "0.0"
                              });
                          } else {
                              const updateData: any = {};
                              if (p.clanBalance) updateData.balance = p.clanBalance.toString();
                              const isLeader = (p.rank && ['leader', 'admin', 'владелец', 'owner'].includes(p.rank.toLowerCase())) ||
                                               (p.clanRank && ['leader', 'лидер', 'owner', 'владелец'].includes(p.clanRank.toLowerCase()));
                              if (isLeader) updateData.leader = p.name;
                              if (Object.keys(updateData).length > 0) {
                                  await db.update(clans).set(updateData).where(eq(clans.name, clanName));
                              }
                          }
                      }
                  }

                  // Update User
                  const foundUsers = p.uuid
                      ? await db.select().from(users).where(or(eq(users.minecraftUuid, p.uuid), eq(users.username, p.name)))
                      : await db.select().from(users).where(eq(users.username, p.name));
                  const user = foundUsers[0];
                  if (user) {
                      let balance = 0, realBalance = 0, kills = 0, deaths = 0;
                      try {
                          if (p.balance) balance = parseFloat(p.balance.toString().replace(/[^0-9.-]+/g,""));
                          if (p.realBalance) realBalance = parseFloat(p.realBalance.toString().replace(/[^0-9.-]+/g,""));
                          if (p.kills) kills = parseInt(p.kills.toString().replace(/[^0-9]+/g,""));
                          if (p.deaths) deaths = parseInt(p.deaths.toString().replace(/[^0-9]+/g,""));
                      } catch (e) {}

                      await db.update(users).set({ 
                          balance: isNaN(balance) ? 0 : Math.round(balance),
                          realBalance: isNaN(realBalance) ? 0 : Math.round(realBalance),
                          clan: p.clan ? p.clan.replace(/[\[\]]/g, "") : null,
                          rank: p.rank,
                          kills: isNaN(kills) ? 0 : kills,
                          deaths: isNaN(deaths) ? 0 : deaths
                      }).where(eq(users.id, user.id));
                  }
              }
          }

          // Update Clans List (Full Sync)
          if (Array.isArray(clansList)) {
              for (const c of clansList) {
                  const clanName = c.name ? c.name.replace(/[\[\]]/g, "") : "";
                  if (!clanName) continue;
                  const existing = await db.select().from(clans).where(eq(clans.name, clanName));
                  let kdrStr = "0.0";
                  if (c.kdr !== undefined) kdrStr = typeof c.kdr === 'number' ? c.kdr.toFixed(2) : c.kdr.toString();
                  if (existing.length === 0) {
                      await db.insert(clans).values({
                          name: clanName,
                          leader: c.leader || "Unknown",
                          membersCount: c.membersCount || 1,
                          rank: c.rank || 0,
                          balance: c.balance ? c.balance.toString() : "0",
                          kdr: kdrStr
                      });
                  } else {
                      await db.update(clans).set({
                          leader: c.leader || existing[0].leader,
                          membersCount: c.membersCount || existing[0].membersCount,
                          rank: c.rank || existing[0].rank,
                          balance: c.balance ? c.balance.toString() : existing[0].balance,
                          kdr: kdrStr
                      }).where(eq(clans.name, clanName));
                  }
              }
          }
          return res.status(200).json({ status: "synced" });
      }
      return res.status(400).json({ message: "Unknown action" });
    } catch (error: any) {
        console.error('Plugin handler error:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists", field: "username" });
      }
      const user = await storage.createUser(input);
      req.session.userId = user.id;
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.session.userId = user.id;
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(api.clans.list.path, async (req, res) => {
    const clans = await storage.getClans();
    res.status(200).json(clans);
  });

  // Linking Code Generation
  app.post(api.auth.generateCode.path, async (req, res) => {
    console.log(`[AUTH] POST /api/auth/code/generate - Session ID: ${req.sessionID}`);
    console.log(`[AUTH] Session data:`, JSON.stringify(req.session, null, 2));

    if (!req.session?.userId) {
      console.warn(`[AUTH] generateCode failed: No userId in session. Session dump:`, req.session);
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      console.warn(`[AUTH] generateCode failed: User not found for ID ${req.session.userId}`);
      return res.status(401).json({ message: "User not found" });
    }

    try {
      console.log(`[AUTH] Generating code for user: ${user.username} (ID: ${user.id})`);
      const code = await storage.generateAuthCode(user.id, user.username);
      console.log(`[AUTH] Code generated successfully: ${code}`);
      res.status(200).json({ code });
    } catch (err) {
      console.error("[AUTH] Route error generating code:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

// Ensure session type includes userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}
