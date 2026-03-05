import { db } from "../lib/db.js";
import { users, clans, serverStats, authCodes } from "../../shared/schema.js";
import { eq, sql, and, gt } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Basic API Key check
  const body = req.body || {};
  const query = req.query || {};
  const apiKey = body.secret || query.secret;
  const validKey = process.env.API_KEY || "skviirtl_secret_key_123";

  if (apiKey !== validKey) {
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
        if (!authCode.userId) return res.status(400).json({ message: "Code not linked to user" });

        await db.update(users)
            .set({ username, minecraftUuid: uuid || null })
            .where(eq(users.id, authCode.userId));
        
        await db.delete(authCodes).where(eq(authCodes.id, authCode.id));
        return res.status(200).json({ success: true });
    }

    // === SYNC (Main sync logic) ===
    // If action is sync or undefined (default)
    if (!action || action === 'sync') {
        // ... (Paste full sync logic here) ...
        // Due to complexity, I'll copy the sync logic structure but keep it in one file.
        // To avoid code duplication, I will just reference the logic I wrote before.
        // But for this file to be complete, I must include it.
        
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
                            // Update existing clan info if we have better data from player context
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
                const foundUsers = await db.select().from(users).where(eq(users.username, p.name));
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
      return res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}