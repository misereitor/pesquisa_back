import pool from '../config/db'; // Importa o pool do mysql2/promise

export async function customQuery(text: string, values: any) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rows, fields] = await pool.execute(text, values);

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
