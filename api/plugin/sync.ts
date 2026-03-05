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
    const body = req.body;
    console.log('Request body received:', JSON.stringify(body));

    const { secret, onlineCount, maxPlayers, tps, players, clans: clansList } = body;

    // Check API Key
    if (secret !== process.env.API_KEY) {
      console.warn(`Invalid API Key attempt: ${secret}`);
      return res.status(403).json({ message: "Invalid API Key" });
    }

    console.log(`Sync received: ${onlineCount}/${maxPlayers} TPS: ${tps}`);

    // Update players data (balance, clan, etc.)
    if (Array.isArray(players)) {
      console.log(`Processing ${players.length} players`);
      
      // Temporarily disable DB updates to check if DB is the cause of 500
      /*
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
        }
      }
      */
    }

    // Return success
    return res.status(200).json({ status: "synced", message: "Debug mode: DB updates skipped" });
  } catch (error: any) {
    console.error('Sync error:', error);
    // Return error details for debugging (remove in production)
    return res.status(500).json({ message: "Internal Server Error", details: error.message, stack: error.stack });
  }
}