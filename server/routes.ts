import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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