import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(0).notNull(),
  realBalance: integer("real_balance").default(0).notNull(),
  clanId: integer("clan_id"),
});

export const clans = pgTable("clans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  leader: text("leader").notNull(),
  coLeaders: text("co_leaders"),
  membersCount: integer("members_count").notNull().default(1),
  level: integer("level").notNull().default(1),
});

export const serverStats = pgTable("server_stats", {
  id: serial("id").primaryKey(),
  onlineCount: integer("online_count").default(0),
  maxPlayers: integer("max_players").default(0),
  tps: text("tps").default("20.0"),
  playersData: text("players_data").default("[]"), // JSON string
  lastUpdated: text("last_updated"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClanSchema = createInsertSchema(clans).omit({ id: true });
export const insertServerStatsSchema = createInsertSchema(serverStats);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type ServerStats = typeof serverStats.$inferSelect;
export type InsertServerStats = z.infer<typeof insertServerStatsSchema>;
