// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users, clans, serverStats } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug log
  console.log('Sync endpoint hit');
  
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      // Helper to parse body manually if req.body fails (Vercel sometimes fails to parse JSON from Java clients)
      let body;
      try {
        body = req.body;
        // If body is undefined or empty object (and we expect data), try manual parsing
        if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
           throw new Error("Body empty or not parsed");
        }
      } catch (e) {
        console.log("Auto-parsing failed or empty, trying manual parse...");
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        // console.log("Raw body data:", data); // Don't log full data in production
        if (!data) throw new Error("Empty body received");
        body = JSON.parse(data);
      }

      console.log('Request body parsed successfully');
  
      const { secret, onlineCount, maxPlayers, tps, players, clans: clansList } = body;
  
    // Check API Key
    // Fallback to hardcoded key if env var is missing (for easier setup)
    const validKey = process.env.API_KEY || "skviirtl_secret_key_123";
    
    if (secret !== validKey) {
      console.warn(`Invalid API Key attempt: ${secret}`);
      return res.status(403).json({ message: "Invalid API Key" });
    }
  
    console.log(`Sync received: ${onlineCount}/${maxPlayers} TPS: ${tps}`);

    // Update Server Stats (Online Count)
    try {
        // We use ID 1 for global stats
        const existingStats = await db.select().from(serverStats).where(eq(serverStats.id, 1));
        if (existingStats.length === 0) {
            await db.insert(serverStats).values({ 
                id: 1, 
                onlineCount, 
                maxPlayers, 
                tps: tps?.toString(),
                lastUpdated: new Date().toISOString()
            });
        } else {
            await db.update(serverStats).set({ 
                onlineCount, 
                maxPlayers, 
                tps: tps?.toString(),
                lastUpdated: new Date().toISOString()
            }).where(eq(serverStats.id, 1));
        }
    } catch (e) {
        console.error("Failed to update server stats:", e);
    }
  
    // Update players data (balance, clan, etc.)
    if (Array.isArray(players)) {
      console.log(`Processing ${players.length} players`);
      
      for (const p of players) {
        // 1. Process Clan (independent of user registration)
        if (p.clan) {
            const clanName = p.clan.replace(/[\[\]]/g, ""); // Remove brackets e.g. [Warden] -> Warden
            if (clanName && clanName.length > 0) {
                // Check if clan exists
                const existingClans = await db.select().from(clans).where(eq(clans.name, clanName));
                
                if (existingClans.length === 0) {
                    console.log(`Auto-creating clan from player data: ${clanName}`);
                    try {
                        await db.insert(clans).values({
                            name: clanName,
                            leader: p.rank === "leader" || p.rank === "Leader" ? p.name : "Unknown",
                            membersCount: 1,
                            rank: 0,
                            balance: "0",
                            kdr: "0.0"
                        });
                    } catch (err) {
                        console.error(`Failed to auto-create clan ${clanName}:`, err);
                    }
                }
            }
        }

        // 2. Process User (if registered)
        // Find user by username (case-insensitive)
        // Note: In a real app, use ilike or lower(). For now, we assume exact match or handle simple case.
        // Drizzle doesn't support ilike easily in all drivers without sql operator, so we fetch all matching simple.
        const foundUsers = await db.select().from(users).where(eq(users.username, p.name));
        const user = foundUsers[0];
        
        if (user) {
          // Update user stats
          let balance = 0;
          try {
             if (p.balance) {
                // Remove currency symbols and parse
                balance = parseFloat(p.balance.toString().replace(/[^0-9.-]+/g,""));
             }
          } catch (e) {}

          console.log(`Updating user ${user.username} (ID: ${user.id}) - Balance: ${balance}, Clan: ${p.clan}`);
          
          await db.update(users)
            .set({ 
               balance: isNaN(balance) ? 0 : Math.round(balance), // Store as integer (cents) or simple int if currency is simple
               clan: p.clan ? p.clan.replace(/[\[\]]/g, "") : null, // Store clean name
               rank: p.rank
            })
            .where(eq(users.id, user.id));
        }
      }
    }

    // Update Clans List
    if (Array.isArray(clansList)) {
        console.log(`Processing ${clansList.length} clans`);
        // For simplicity, we can upsert clans. 
        // Note: Ideally we should handle deletions too (clans that no longer exist), but for a top list sync, upsert is okay.
        for (const c of clansList) {
            if (!c.name) continue;

            const foundClans = await db.select().from(clans).where(eq(clans.name, c.name));
            
            if (foundClans.length === 0) {
                await db.insert(clans).values({
                    name: c.name,
                    leader: c.leader,
                    balance: c.balance?.toString(),
                    kdr: c.kdr?.toString(),
                    rank: c.rank,
                    membersCount: 0 // Placeholder
                });
            } else {
                await db.update(clans).set({
                    leader: c.leader,
                    balance: c.balance?.toString(),
                    kdr: c.kdr?.toString(),
                    rank: c.rank
                }).where(eq(clans.name, c.name));
            }
        }
    }
  
    // Return success
    return res.status(200).json({ status: "synced" });
  } catch (error: any) {
    console.error('Sync error:', error);
    // Return error details for debugging (remove in production)
    return res.status(500).json({ message: "Internal Server Error", details: error.message, stack: error.stack });
  }
}