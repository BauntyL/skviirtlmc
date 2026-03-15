import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(0).notNull(),
  realBalance: integer("real_balance").default(0).notNull(),
  clan: text("clan"), // Clan name string from plugin
  rank: text("rank"),
  role: text("role").default("user"),
  kills: integer("kills").default(0),
  deaths: integer("deaths").default(0),
  minecraftUuid: text("minecraft_uuid"), // For verified linking
});

// Добавляем таблицу сессий в схему, чтобы Drizzle не удалял её при синхронизации
export const session = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
});

export const clans = pgTable("clans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  leader: text("leader"),
  balance: text("balance"), // Store as text or bigInt? Plugin sends formatted string sometimes, but let's try text for now or parse. Plugin sends "1000.0".
  kdr: text("kdr"), // Plugin sends float string
  membersCount: integer("members_count").default(0),
  rank: integer("rank").default(0), // Rank in top list
});

export const serverStats = pgTable("server_stats", {
  id: serial("id").primaryKey(),
  onlineCount: integer("online_count").default(0),
  maxPlayers: integer("max_players").default(0),
  tps: text("tps"),
  lastUpdated: text("last_updated"), // ISO string
});

export const griefReports = pgTable("grief_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  username: text("username").notNull(),
  minecraftUuid: text("minecraft_uuid").notNull(),
  coordinates: text("coordinates").notNull(),
  time: text("time").notNull(),
  description: text("description"),
  status: text("status").default("pending").notNull(), // pending, in_progress, resolved, rejected
  createdAt: text("created_at").notNull(), // ISO string
});

export const insertGriefReportSchema = createInsertSchema(griefReports).omit({ 
  id: true,
  createdAt: true,
  status: true 
});

export type GriefReport = typeof griefReports.$inferSelect;
export type InsertGriefReport = z.infer<typeof insertGriefReportSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClanSchema = createInsertSchema(clans).omit({ id: true });
export const insertServerStatsSchema = createInsertSchema(serverStats).omit({ id: true });

export const authCodes = pgTable("auth_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Optional: if linking existing account
  username: text("username").notNull(), 
  code: text("code").notNull(),
  expiresAt: text("expires_at").notNull(), // ISO date string
});

export const insertAuthCodeSchema = createInsertSchema(authCodes).pick({
  username: true,
  code: true,
  expiresAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type ServerStats = typeof serverStats.$inferSelect;
