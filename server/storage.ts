import { users, clans, type User, type InsertUser, type Clan, type InsertClan } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getClans(): Promise<Clan[]>;
  createClan(clan: InsertClan): Promise<Clan>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clans: Map<number, Clan>;
  currentUserId: number;
  currentClanId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.clans = new Map();
    this.currentUserId = 1;
    this.currentClanId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getClans(): Promise<Clan[]> {
    return Array.from(this.clans.values());
  }

  async createClan(insertClan: InsertClan): Promise<Clan> {
    const id = this.currentClanId++;
    const clan: Clan = { ...insertClan, id };
    this.clans.set(id, clan);
    return clan;
  }
}

export const storage = new MemStorage();
