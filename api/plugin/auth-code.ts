// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { authCodes } from "../../shared/schema.js";
import { eq, sql } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Basic API Key check
  const apiKey = req.body.secret || req.query.secret;
  const validKey = process.env.API_KEY || "skviirtl_secret_key_123";

  if (apiKey !== validKey) {
      return res.status(403).json({ message: 'Invalid API Key' });
  }

  const { username, code } = req.body;

  if (!username || !code) {
      return res.status(400).json({ message: 'Missing username or code' });
  }

  try {
      // Clean up old codes for this user
      await db.delete(authCodes).where(eq(authCodes.username, username));

      // Insert new code
      // Expires in 5 minutes
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      
      await db.insert(authCodes).values({
          username,
          code,
          expiresAt
      });

      return res.status(200).json({ success: true });
  } catch (error: any) {
      console.error('Auth code error:', error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
}