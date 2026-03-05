import { db } from "./db";
import { users, clans, type User, type InsertUser, type Clan, type InsertClan } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getClans(): Promise<Clan[]>;
  createClan(clan: InsertClan): Promise<Clan>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({ pool, createTableIfMissing: true });
  }

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
