
import pg from "pg";
const { Pool } = pg;
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function cleanup() {
  try {
    console.log("Cleaning up junk clans...");
    const res = await pool.query("DELETE FROM clans WHERE LOWER(name) LIKE '%не в команде%' OR name = 'Unknown' OR name = ''");
    console.log(`Successfully deleted ${res.rowCount} junk clans.`);
    
    console.log("Resetting player clan data for junk clans...");
    const res2 = await pool.query("UPDATE users SET clan = NULL WHERE LOWER(clan) LIKE '%не в команде%' OR clan = 'Unknown'");
    console.log(`Successfully reset clan data for ${res2.rowCount} users.`);
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    await pool.end();
  }
}
cleanup();
