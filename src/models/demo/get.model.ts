import pool from "@/config/db";

export const findAll = async () => {
  const [row] = await pool.query("SELECT id, name, email, created_at AS createdAt FROM demo");
  return row;
};
