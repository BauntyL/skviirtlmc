// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);

  // If no user in session, return 401
  if (!session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // If mock session for demo (userId 999)
    if (session.userId === 999) {
      return res.status(200).json({ id: 999, username: "DemoUser", isAdmin: false });
    }

    // Find user in DB
    const foundUsers = await db.select().from(users).where(eq(users.id, session.userId));
    
    if (foundUsers.length === 0) {
      // User might be deleted, clear session
      session.destroy();
      return res.status(401).json({ message: "User not found" });
    }

    const user = foundUsers[0];
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Me error:', error);
    // If DB fails but session exists, maybe return 401 or 500. 
    // For resilience, let's return 401 so the UI redirects to login instead of crashing.
    return res.status(401).json({ message: "Session invalid or DB error" });
  }
}