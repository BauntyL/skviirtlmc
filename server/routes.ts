import type { Express } from "express";
import type { Server } from "http";
import { storage, setupAuth } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

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

  // Sync endpoint from Minecraft Server
  app.post("/api/sync", async (req, res) => {
    try {
      const { secret, onlineCount, maxPlayers, tps, players } = req.body;
      
      // Simple secret check (should be in env vars in prod)
      if (secret !== "my_secret_key") {
        return res.status(403).json({ message: "Invalid secret" });
      }

      console.log(`[Sync] Received data: ${onlineCount}/${maxPlayers} players, TPS: ${tps}`);
      
      // Here you would typically update the database with new stats
      // For now we just log it and maybe store in memory or a simple file
      await storage.updateServerStats({ onlineCount, maxPlayers, tps, players });
      
      res.status(200).json({ status: "ok" });
    } catch (err) {
      console.error("Sync error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    const stats = await storage.getServerStats();
    res.status(200).json(stats);
  });

  return httpServer;
}

// Ensure session type includes userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}
