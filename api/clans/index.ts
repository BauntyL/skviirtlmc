// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { clans } from "../../shared/schema.js";
import { desc } from "drizzle-orm";
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
    // Get top clans by rank (or balance)
    const clansList = await db.select().from(clans).orderBy(desc(clans.rank));
    
    return res.status(200).json(clansList);
  } catch (error: any) {
    console.error('Clans error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}