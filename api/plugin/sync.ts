// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug log
  console.log('Sync endpoint hit');
  console.log('Method:', req.method);
  
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
        console.log("Raw body data:", data);
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
  
    // Update players data (balance, clan, etc.)
    if (Array.isArray(players)) {
      console.log(`Processing ${players.length} players`);
      
      for (const p of players) {
        // Find user by username (case-insensitive ideally, but simple for now)
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

          // We found the user!
          console.log(`Updating user ${user.username} (ID: ${user.id})`);
          
          // If you add 'balance' and 'clan' to schema, uncomment below:
          /*
          await db.update(users)
            .set({ 
               // balance: isNaN(balance) ? 0 : balance,
               // clan: p.clan
            })
            .where(eq(users.id, user.id));
          */
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