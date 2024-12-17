import pool from '../config/db';

export async function queryCuston(text: string, values: any) {
  const client = await pool.connect();
  try {
    const query = {
      text,
      values
    };
    const rows = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
}
