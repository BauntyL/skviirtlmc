// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { authCodes, users } from "../../shared/schema.js";
import { eq, and, gt } from "drizzle-orm";
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

  const { username, code, uuid } = req.body;

  if (!username || !code) {
      return res.status(400).json({ message: 'Missing username or code' });
  }

  try {
      const now = new Date().toISOString();
      
      // Find valid code linked to a user
      const foundCodes = await db.select().from(authCodes)
          .where(and(
              eq(authCodes.code, code),
              gt(authCodes.expiresAt, now)
          ));

      if (foundCodes.length === 0) {
          return res.status(404).json({ message: "Invalid or expired code" });
      }

      const authCode = foundCodes[0];
      
      if (!authCode.userId) {
          return res.status(400).json({ message: "Code not linked to any user" });
      }

      // Update user
      await db.update(users)
          .set({ 
              username: username, // Update username to match MC
              minecraftUuid: uuid || null
          })
          .where(eq(users.id, authCode.userId));

      // Delete code
      await db.delete(authCodes).where(eq(authCodes.id, authCode.id));

      return res.status(200).json({ success: true, message: "Linked successfully" });
  } catch (error: any) {
      console.error('Verify code error:', error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
}