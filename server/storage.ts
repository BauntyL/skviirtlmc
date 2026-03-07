import { db } from "./db";
import { users, clans, authCodes, type User, type InsertUser, type Clan, type InsertClan } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
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
  generateAuthCode(userId: number, username: string): Promise<string>;
  verifyAuthCode(username: string, code: string): Promise<boolean>;
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

  async generateAuthCode(userId: number, username: string): Promise<string> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    console.log(`Generating code for ${username} (ID: ${userId}): ${code}`);
    
    try {
      // Удаляем старые коды этого пользователя
      console.log(`Deleting old codes for ${username}...`);
      await db.delete(authCodes).where(eq(authCodes.username, username));
      
      console.log(`Inserting new code ${code} for ${username}...`);
      await db.insert(authCodes).values({ 
        username, 
        code, 
        expiresAt,
        userId
      });
      console.log(`Code generated successfully.`);
      return code;
    } catch (err) {
      console.error("CRITICAL ERROR in generateAuthCode:", err);
      throw err;
    }
  }

  async verifyAuthCode(username: string, code: string): Promise<boolean> {
    const now = new Date().toISOString();
    const [found] = await db.select().from(authCodes)
      .where(and(
        eq(authCodes.username, username),
        eq(authCodes.code, code),
        gt(authCodes.expiresAt, now)
      ));
    
    if (!found) return false;

    // Удаляем использованный код
    await db.delete(authCodes).where(eq(authCodes.id, found.id));
    return true;
  }
}

export const storage = new DatabaseStorage();
