// @ts-ignore
import { db } from "./lib/db.js";
// @ts-ignore
import { serverStats } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const stats = await db.select().from(serverStats).where(eq(serverStats.id, 1));
    
    if (stats.length === 0) {
      return res.status(200).json({ onlineCount: 0, maxPlayers: 0, tps: "N/A" });
    }

    return res.status(200).json(stats[0]);
  } catch (error: any) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}