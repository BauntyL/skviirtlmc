import { db } from "./db";
import { users, clans, type User, type InsertUser, type Clan, type InsertClan } from "@shared/schema";
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getClans(): Promise<Clan[]> {
    return await db.select().from(clans);
  }

  async createClan(insertClan: InsertClan): Promise<Clan> {
    const [clan] = await db.insert(clans).values(insertClan).returning();
    return clan;
  }
}

export const storage = new DatabaseStorage();
