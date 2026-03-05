// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users, authCodes } from "../../shared/schema.js";
import { eq, and, gt } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIronSession } from "iron-session";
import { sessionOptions } from "../lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);

  try {
    const { username, code } = req.body;
    
    if (!username || !code) {
      return res.status(400).json({ message: "Username and code are required" });
    }

    // Check code in DB
    const now = new Date().toISOString();
    const foundCodes = await db.select().from(authCodes)
        .where(and(
            eq(authCodes.username, username),
            eq(authCodes.code, code),
            gt(authCodes.expiresAt, now)
        ));

    if (foundCodes.length === 0) {
        return res.status(401).json({ message: "Invalid or expired code" });
    }

    // Code valid! Find or Create user
    let user;
    const foundUsers = await db.select().from(users).where(eq(users.username, username));
    
    if (foundUsers.length > 0) {
        user = foundUsers[0];
    } else {
        // Create new user if not exists (auto-register via code)
        // Generate random password since they use code login
        const randomPass = Math.random().toString(36).slice(-8);
        const newUser = await db.insert(users).values({
            username,
            password: randomPass,
            balance: 0,
            role: "user"
        }).returning();
        user = newUser[0];
    }

    // Delete used code
    await db.delete(authCodes).where(eq(authCodes.id, foundCodes[0].id));

    // Save session
    session.userId = user.id;
    await session.save();

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}