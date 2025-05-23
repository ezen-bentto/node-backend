import mariadb, { Pool, PoolConnection } from "mariadb";

const pool: Pool = mariadb.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  connectionLimit: 5,
});

export async function asyncFunction(): Promise<void> {
  let conn: PoolConnection | null = null;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query("SELECT 1 as val");
    console.log("Query Result:", rows); // Optional: debug

    const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    console.log("Insert Result:", res); // Optional: debug
  } catch (err) {
    console.error("Database Error:", err);
  } finally {
    if (conn) conn.release(); // release to pool
  }
}
