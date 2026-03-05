// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { authCodes } from "../../shared/schema.js";
import { eq, sql } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIronSession } from "iron-session";
import { sessionOptions } from "../lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);
  
  if (!session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      // Clean up old codes for this user
      await db.delete(authCodes).where(eq(authCodes.userId, session.userId));

      // Generate random 4 digit code
      const code = String(Math.floor(1000 + Math.random() * 9000));
      
      // Expires in 5 minutes
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      
      await db.insert(authCodes).values({
          userId: session.userId,
          username: "pending_link", // Placeholder
          code,
          expiresAt
      });

      return res.status(200).json({ code });
  } catch (error: any) {
      console.error('Generate code error:', error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
}