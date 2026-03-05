import { db } from "./db";
import { users, clans, serverStats, type User, type InsertUser, type Clan, type InsertClan } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresStore = connectPg(session);

export function setupAuth(app: any) {
  app.use(
    session({
      store: new PostgresStore({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "skviirtl_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true in production with HTTPS
    })
  );
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getClans(): Promise<Clan[]>;
  createClan(clan: InsertClan): Promise<Clan>;
  updateServerStats(stats: any): Promise<void>;
  getServerStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // In-memory fallback for when DB is not available
  private memoryStats: any = { onlineCount: 0, maxPlayers: 100, tps: "20.0", players: [] };

  async getUser(id: number): Promise<User | undefined> {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    } catch (e) {
        return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
    } catch (e) {
        return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
    } catch (e) {
        // Fallback mock user if DB fails (for dev only)
        return { ...insertUser, id: 1, isAdmin: false } as User;
    }
  }

  async getClans(): Promise<Clan[]> {
    try {
        return await db.select().from(clans);
    } catch (e) {
        return [];
    }
  }

  async createClan(insertClan: InsertClan): Promise<Clan> {
    try {
        const [clan] = await db.insert(clans).values(insertClan).returning();
        return clan;
    } catch (e) {
        throw new Error("DB error");
    }
  }

  async updateServerStats(stats: any): Promise<void> {
    // Always update memory first (fastest)
    this.memoryStats = {
        onlineCount: stats.onlineCount,
        maxPlayers: stats.maxPlayers,
        tps: stats.tps,
        players: stats.players || []
    };

    try {
        // Try to persist to DB
        const [existing] = await db.select().from(serverStats).limit(1);
        
        const updateData = {
            onlineCount: stats.onlineCount,
            maxPlayers: stats.maxPlayers,
            tps: stats.tps,
            playersData: JSON.stringify(stats.players || []),
            lastUpdated: new Date().toISOString()
        };

        if (existing) {
            await db.update(serverStats).set(updateData).where(eq(serverStats.id, existing.id));
        } else {
            await db.insert(serverStats).values(updateData);
        }
    } catch (e) {
        // Ignore DB errors for stats, memory is enough for local
    }
  }

  async getServerStats(): Promise<any> {
    try {
        const [stats] = await db.select().from(serverStats).limit(1);
        if (stats) {
            // Update memory cache from DB (if we are a fresh instance)
            this.memoryStats = {
                onlineCount: stats.onlineCount,
                maxPlayers: stats.maxPlayers,
                tps: stats.tps,
                players: JSON.parse(stats.playersData || "[]")
            };
        }
    } catch (e) {
        // DB failed, use memory
    }
    return this.memoryStats;
  }
}

export const storage = new DatabaseStorage();
