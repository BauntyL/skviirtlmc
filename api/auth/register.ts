import { db } from "../../server/db";
import { users, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists
    const existingUsers = await db.select().from(users).where(eq(users.username, username));
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create user
    const newUser: InsertUser = { username, password };
    const [createdUser] = await db.insert(users).values(newUser).returning();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = createdUser;
    
    // Note: Cookies/Sessions in serverless are tricky without a dedicated auth service or Redis.
    // For now, we will just return success. Client can store a token or we can setup JWT later.
    // Since we don't have Redis, we can't use express-session easily across serverless functions.
    // We will proceed with simple success response for now to unblock registration.
    
    return res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}