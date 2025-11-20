import { getDB } from "./database.js";

export const dbQuery = async (sql, params = []) => {
  const pool = getDB();
  const [rows] = await pool.execute(sql, params);
  return rows;
};
