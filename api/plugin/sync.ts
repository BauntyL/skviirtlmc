// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { secret, onlineCount, maxPlayers, tps, players, clans: clansList } = req.body;

  // Check API Key
  if (secret !== process.env.API_KEY) {
    console.warn(`Invalid API Key attempt: ${secret}`);
    return res.status(403).json({ message: "Invalid API Key" });
  }

  try {
    console.log(`Sync received: ${onlineCount}/${maxPlayers} TPS: ${tps}`);

    // Update players data (balance, clan, etc.)
    if (Array.isArray(players)) {
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

          // We don't have balance column in schema yet, let's assume we might add it.
          // For now, we just acknowledge we found the user.
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
    return res.status(500).json({ message: "Internal Server Error" });
  }
}