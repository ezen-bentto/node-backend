import pool from "@/config/db";
import { DemoCreate } from "@/schemas/demo.schema";

export const create = async (data: DemoCreate) => {
  const { id, name, email } = data;
  const [result] = await pool.query("INSERT INTO demo (id, name, email) VALUES (?, ?, ?)", [
    id,
    name,
    email,
  ]);

  const insertId = (result as any).insertId;
  const [newRows] = await pool.query(
    "SELECT id, name, email, created_at AS createdAt FROM demo WHERE id = ?",
    [insertId]
  );

  return newRows[0];
};
