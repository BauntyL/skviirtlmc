import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
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
  kills: integer("kills").default(0),
  deaths: integer("deaths").default(0),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClanSchema = createInsertSchema(clans).omit({ id: true });
export const insertServerStatsSchema = createInsertSchema(serverStats).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type ServerStats = typeof serverStats.$inferSelect;
