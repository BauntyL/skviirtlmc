import { db } from "./db";
import { users, clans, authCodes, griefReports, tournamentMatches, type User, type InsertUser, type Clan, type InsertClan, type GriefReport, type InsertGriefReport, type TournamentMatch, type InsertTournamentMatch } from "@shared/schema";
import { eq, and, gt, desc, asc } from "drizzle-orm";
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
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  generateAuthCode(userId: number, username: string): Promise<string>;
  verifyAuthCode(username: string, code: string): Promise<boolean>;
  
  // Grief Reports
  createGriefReport(report: InsertGriefReport): Promise<GriefReport>;
  getGriefReports(userId?: number): Promise<GriefReport[]>;
  updateGriefReportStatus(id: number, status: string): Promise<GriefReport | undefined>;

  // Tournament
  getTournamentMatches(): Promise<TournamentMatch[]>;
  updateTournamentMatch(id: number, match: Partial<TournamentMatch>): Promise<TournamentMatch | undefined>;
  resetTournament(): Promise<void>;
  
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

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
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

  async createGriefReport(report: InsertGriefReport): Promise<GriefReport> {
    const [newReport] = await db.insert(griefReports).values({
      ...report,
      createdAt: new Date().toISOString(),
      status: "pending"
    }).returning();
    return newReport;
  }

  async getGriefReports(userId?: number): Promise<GriefReport[]> {
    if (userId) {
      return await db.select().from(griefReports).where(eq(griefReports.userId, userId)).orderBy(desc(griefReports.id));
    }
    return await db.select().from(griefReports).orderBy(desc(griefReports.id));
  }

  async updateGriefReportStatus(id: number, status: string): Promise<GriefReport | undefined> {
    const [updated] = await db.update(griefReports)
      .set({ status })
      .where(eq(griefReports.id, id))
      .returning();
    return updated;
  }

  async getTournamentMatches(): Promise<TournamentMatch[]> {
    const matches = await db.select().from(tournamentMatches).orderBy(asc(tournamentMatches.round), asc(tournamentMatches.position));
    
    // If no matches exist, initialize them for 6 teams
    if (matches.length === 0) {
      await this.resetTournament();
      return await db.select().from(tournamentMatches).orderBy(asc(tournamentMatches.round), asc(tournamentMatches.position));
    }
    
    return matches;
  }

  async updateTournamentMatch(id: number, match: Partial<TournamentMatch>): Promise<TournamentMatch | undefined> {
    const [updated] = await db.update(tournamentMatches)
      .set(match)
      .where(eq(tournamentMatches.id, id))
      .returning();
    return updated;
  }

  async resetTournament(): Promise<void> {
    await db.delete(tournamentMatches);
    
    // 4 teams tournament structure:
    // Round 1 (Semi-finals): 2 matches
    // Round 2 (Final): 1 match
    
    await db.insert(tournamentMatches).values([
      // Round 1: 2 semi-finals
      { round: 1, position: 0, player1: null, player2: null, status: "pending" },
      { round: 1, position: 1, player1: null, player2: null, status: "pending" },
      // Round 2: Final
      { round: 2, position: 0, player1: null, player2: null, status: "pending" },
    ]);
  }
}

export const storage = new DatabaseStorage();
