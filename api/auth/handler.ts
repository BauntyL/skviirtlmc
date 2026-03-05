import { db } from "../lib/db.js";
import { users, authCodes } from "../../shared/schema.js";
import { eq, and, gt, sql } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIronSession, SessionData } from "iron-session";
import { sessionOptions } from "../lib/session.js";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes(".")) {
    // Legacy plain text password check (for migration) or bad format
    if (stored === supplied) return true;
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!salt) return false;
  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return buf.toString("hex") === hashed;
}

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

  // Get action type from query or body
  let body: any = {};
  
  // Vercel serverless functions body parsing fix
  try {
      // Safely check if body exists without triggering the getter if it's malformed
      // In Vercel Node runtime, req.body might be a getter that throws.
      // We use a safe access pattern or just assume it might throw.
      // But we already have the try-catch block.
      // The issue is `const rawBody = req.body` IS the line that throws.
      // So we need to be very careful.
      // Let's try to access it directly inside the try.
      
      if (req.body) {
         // If req.body is accessible
         if (typeof req.body === 'object') {
             body = req.body;
         } else if (typeof req.body === 'string') {
             body = JSON.parse(req.body);
         }
      }
  } catch (e) {
      console.error("Failed to parse body:", e);
      // Fallback: maybe it's in a different property or we just ignore it
  }

  const type = req.query.type || body.type;
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  try {
    // === REGISTER ===
    if (type === 'register') {
        const username = body.username;
        const password = body.password;
        if (!username || !password) return res.status(400).json({ message: "Missing fields" });

        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await hashPassword(password);
        const [user] = await db.insert(users).values({
            username,
            password: hashedPassword,
            balance: 0,
            realBalance: 0,
            kills: 0,
            deaths: 0,
            role: "user"
        }).returning();

        session.userId = user.id;
        await session.save();
        
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    }

    // === LOGIN ===
    if (type === 'login') {
        const username = body.username;
        const password = body.password;
        if (!username || !password) return res.status(400).json({ message: "Missing fields" });
        
        const [user] = await db.select().from(users).where(eq(users.username, username));
        
        if (!user || !(await comparePasswords(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        session.userId = user.id;
        await session.save();
        
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    }

    // === LOGIN CODE ===
    if (type === 'login-code') {
        const username = body.username;
        const code = body.code;
        if (!username || !code) return res.status(400).json({ message: "Missing fields" });

        const now = new Date().toISOString();
        const foundCodes = await db.select().from(authCodes)
            .where(and(
                eq(authCodes.username, username),
                eq(authCodes.code, code),
                gt(authCodes.expiresAt, now)
            ));

        if (foundCodes.length === 0) return res.status(401).json({ message: "Invalid or expired code" });

        let user;
        const foundUsers = await db.select().from(users).where(eq(users.username, username));
        if (foundUsers.length > 0) {
            user = foundUsers[0];
        } else {
            const randomPass = Math.random().toString(36).slice(-8);
            const [newUser] = await db.insert(users).values({
                username,
                password: await hashPassword(randomPass),
                balance: 0,
                role: "user"
            }).returning();
            user = newUser;
        }

        await db.delete(authCodes).where(eq(authCodes.id, foundCodes[0].id));
        session.userId = user.id;
        await session.save();
        
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    }

    // === LOGOUT ===
    if (type === 'logout') {
        session.destroy();
        return res.status(200).json({ message: "Logged out" });
    }

    // === ME ===
    if (type === 'me' || req.method === 'GET') {
        if (!session.userId) return res.status(401).json({ message: "Unauthorized" });
        
        const [user] = await db.select().from(users).where(eq(users.id, session.userId));
        if (!user) return res.status(401).json({ message: "User not found" });
        
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    }

    // === GENERATE CODE (For linking) ===
    if (type === 'generate-code') {
        if (!session.userId) return res.status(401).json({ message: "Unauthorized" });
        const [user] = await db.select().from(users).where(eq(users.id, session.userId));
        if (!user) return res.status(401).json({ message: "User not found" });

        // Generate 4 digit code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        
        await db.delete(authCodes).where(eq(authCodes.username, user.username));
        await db.insert(authCodes).values({ 
            username: user.username, 
            code, 
            expiresAt,
            userId: user.id
        });
        
        return res.status(200).json({ code });
    }

    return res.status(400).json({ message: "Unknown auth action" });

  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}