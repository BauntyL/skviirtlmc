// @ts-ignore
import { db } from "../lib/db.js";
// @ts-ignore
import { users, clans, serverStats } from "../../shared/schema.js";
import { eq, sql } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug log
  console.log('Sync endpoint hit');
  
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      // Helper to parse body manually if req.body fails (Vercel sometimes fails to parse JSON from Java clients)
      let body;
      try {
        body = req.body;
        // If body is undefined or empty object (and we expect data), try manual parsing
        if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
           throw new Error("Body empty or not parsed");
        }
      } catch (e) {
        console.log("Auto-parsing failed or empty, trying manual parse...");
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        // console.log("Raw body data:", data); // Don't log full data in production
        if (!data) throw new Error("Empty body received");
        body = JSON.parse(data);
      }

      console.log('Request body parsed successfully');
  
      const { secret, onlineCount, maxPlayers, tps, players, clans: clansList } = body;
  
    // Check API Key
    // Fallback to hardcoded key if env var is missing (for easier setup)
    const validKey = process.env.API_KEY || "skviirtl_secret_key_123";
    
    if (secret !== validKey) {
      console.warn(`Invalid API Key attempt: ${secret}`);
      return res.status(403).json({ message: "Invalid API Key" });
    }
  
    console.log(`Sync received: ${onlineCount}/${maxPlayers} TPS: ${tps}`);

    // Update Server Stats (Online Count)
    try {
        // We use ID 1 for global stats
        const existingStats = await db.select().from(serverStats).where(eq(serverStats.id, 1));
        if (existingStats.length === 0) {
            await db.insert(serverStats).values({ 
                id: 1, 
                onlineCount, 
                maxPlayers, 
                tps: tps?.toString(),
                lastUpdated: new Date().toISOString()
            });
        } else {
            await db.update(serverStats).set({ 
                onlineCount, 
                maxPlayers, 
                tps: tps?.toString(),
                lastUpdated: new Date().toISOString()
            }).where(eq(serverStats.id, 1));
        }
    } catch (e) {
        console.error("Failed to update server stats:", e);
    }
  
    // Update players data (balance, clan, etc.)
    if (Array.isArray(players)) {
      // Log first player structure for debugging
      if (players.length > 0) {
        console.log("Sample player data:", JSON.stringify(players[0]));
      }
      
      for (const p of players) {
        // Debug Bauntyl
        if (p.name.toLowerCase() === 'bauntyl') {
            console.log("Processing Bauntyl:", JSON.stringify(p));
        }

        // 1. Process Clan (independent of user registration)
        if (p.clan) {
            const clanName = p.clan.replace(/[\[\]]/g, ""); // Remove brackets e.g. [Warden] -> Warden
            if (p.name.toLowerCase() === 'bauntyl') {
                console.log(`Bauntyl Clan Raw: '${p.clan}', Clean: '${clanName}'`);
            }
            if (clanName && clanName.length > 0) {
                // Check if clan exists
                const existingClans = await db.select().from(clans).where(eq(clans.name, clanName));
                
                if (existingClans.length === 0) {
                    console.log(`Auto-creating clan from player data: ${clanName}`);
                    try {
                        await db.insert(clans).values({
                            name: clanName,
                            leader: (p.clanRank && ['leader', 'лидер', 'owner', 'владелец'].includes(p.clanRank.toLowerCase())) ? p.name : 
                                    (p.rank && ['leader', 'admin', 'moderator'].includes(p.rank.toLowerCase())) ? p.name : "Unknown",
                            membersCount: 1,
                            rank: 0,
                            balance: p.clanBalance ? p.clanBalance.toString() : "0",
                            kdr: "0.0"
                        });
                    } catch (err) {
                        console.error(`Failed to auto-create clan ${clanName}:`, err);
                    }
                } else {
                    // Clan exists, maybe update leader or balance
                    const updateData: any = {};
                    
                    // Check Leader
                    const isLeader = (p.rank && ['leader', 'admin', 'владелец', 'owner'].includes(p.rank.toLowerCase())) ||
                                     (p.clanRank && ['leader', 'лидер', 'owner', 'владелец'].includes(p.clanRank.toLowerCase()));
                    if (isLeader) {
                        updateData.leader = p.name;
                    }
                    
                    // Check Balance
                    if (p.clanBalance) {
                        updateData.balance = p.clanBalance.toString();
                    }
                    
                    if (Object.keys(updateData).length > 0) {
                        await db.update(clans).set(updateData).where(eq(clans.name, clanName));
                    }
                }
            }
        }

        // 2. Process User (if registered)
        // Find user by username (case-insensitive)
        // Note: In a real app, use ilike or lower(). For now, we assume exact match or handle simple case.
        // Drizzle doesn't support ilike easily in all drivers without sql operator, so we fetch all matching simple.
        const foundUsers = await db.select().from(users).where(eq(users.username, p.name));
        const user = foundUsers[0];
        
        if (user) {
          // Update user stats
          let balance = 0;
          let realBalance = 0;
          let kills = 0;
          let deaths = 0;

          try {
             if (p.balance) {
                balance = parseFloat(p.balance.toString().replace(/[^0-9.-]+/g,""));
             }
             if (p.realBalance) {
                realBalance = parseFloat(p.realBalance.toString().replace(/[^0-9.-]+/g,""));
             }
             if (p.kills) {
                kills = parseInt(p.kills.toString().replace(/[^0-9]+/g,""));
             }
             if (p.deaths) {
                deaths = parseInt(p.deaths.toString().replace(/[^0-9]+/g,""));
             }
          } catch (e) {}

          console.log(`Updating user ${user.username} (ID: ${user.id}) - Bal: ${balance}, RealBal: ${realBalance}, Clan: ${p.clan}`);
          
          await db.update(users)
            .set({ 
               balance: isNaN(balance) ? 0 : Math.round(balance),
               realBalance: isNaN(realBalance) ? 0 : Math.round(realBalance),
               clan: p.clan ? p.clan.replace(/[\[\]]/g, "") : null,
               rank: p.rank,
               kills: isNaN(kills) ? 0 : kills,
               deaths: isNaN(deaths) ? 0 : deaths
            })
            .where(eq(users.id, user.id));
        }
      }
    }

    // Update Clans List
    if (Array.isArray(clansList)) {
        console.log(`Processing ${clansList.length} clans`);
        // For simplicity, we can upsert clans. 
        // Note: Ideally we should handle deletions too (clans that no longer exist), but for a top list sync, upsert is okay.
        
        for (const c of clansList) {
            const clanName = c.name ? c.name.replace(/[\[\]]/g, "") : "";
            if (!clanName) continue;

            const existing = await db.select().from(clans).where(eq(clans.name, clanName));
            
            // Format KDR to string with max 2 decimals if it's a number
            let kdrStr = "0.0";
            if (c.kdr !== undefined) {
                kdrStr = typeof c.kdr === 'number' ? c.kdr.toFixed(2) : c.kdr.toString();
            }

            if (existing.length === 0) {
                await db.insert(clans).values({
                    name: clanName,
                    leader: c.leader || "Unknown",
                    membersCount: c.membersCount || 1, // Use sent count or default
                    rank: c.rank || 0,
                    balance: c.balance ? c.balance.toString() : "0",
                    kdr: kdrStr
                });
            } else {
                await db.update(clans).set({
                    leader: c.leader || existing[0].leader,
                    membersCount: c.membersCount || existing[0].membersCount, // Update if provided
                    rank: c.rank || existing[0].rank,
                    balance: c.balance ? c.balance.toString() : existing[0].balance,
                    kdr: kdrStr
                }).where(eq(clans.name, clanName));
            }
        }
    }

    // Update Clan Member Counts and KDR (ONLY if not provided by plugin)
    // If plugin sends full list with membersCount, we might skip this or use it as fallback.
    // Let's keep it as a fallback or for consistency if plugin doesn't send membersCount.
    // But since we updated Java to send membersCount, we can rely on that primarily.
    // However, the Java plugin sends "membersCount" only in the new file parsing mode.
    // If that fails, we fallback to PAPI which doesn't send count.
    // So let's run this calculation only for clans that haven't been updated recently? 
    // Or just run it anyway, it won't hurt to have DB consistency check.
    
    // Actually, if we trust the plugin's membersCount (from YML), we should prefer it because
    // the DB might not have all users synced yet.
    // So let's SKIP this calculation if we received a clansList with data.
    if (!Array.isArray(clansList) || clansList.length === 0) {
        try {
            const clanStats = await db.select({
                clanName: users.clan,
                count: sql`count(*)`,
                totalKills: sql`sum(${users.kills})`,
                totalDeaths: sql`sum(${users.deaths})`
            })
            .from(users)
            .where(sql`${users.clan} IS NOT NULL`)
            .groupBy(users.clan);
    
            for (const stat of clanStats) {
                if (stat.clanName) {
                    // Calculate KDR
                    let kdr = 0;
                    const kills = Number(stat.totalKills) || 0;
                    const deaths = Number(stat.totalDeaths) || 0;
                    if (deaths > 0) {
                        kdr = kills / deaths;
                    } else {
                        kdr = kills; // If 0 deaths, KDR = kills
                    }
    
                    await db.update(clans)
                        .set({ 
                            membersCount: Number(stat.count),
                            kdr: kdr.toFixed(2)
                        })
                        .where(eq(clans.name, stat.clanName));
                }
            }
        } catch (e) {
            console.error("Failed to update clan member counts/KDR:", e);
        }
    }

    // Return success
    return res.status(200).json({ status: "synced" });
  } catch (error: any) {
    console.error('Sync error:', error);
    // Return error details for debugging (remove in production)
    return res.status(500).json({ message: "Internal Server Error", details: error.message, stack: error.stack });
  }
}