import pool from '../config/db';
import { ConfirmedPhone } from '../model/login-user-vote';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createConfirmedLogin(confirmed: ConfirmedPhone) {
  const query = `
    INSERT INTO confirmed_phone
    (phone, id_user_vote, expiration_date, code)
    VALUES
    (?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      confirmed.phone,
      confirmed.id_user_vote,
      confirmed.expiration_date,
      confirmed.code
    ]);

    return { ...confirmed, id: result.insertId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getConfirmationUserVote(phone: string, code: string) {
  const query = `
    SELECT * FROM confirmed_phone WHERE phone LIKE ? and code LIKE ?
  `;
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [phone, code]);

    // Se precisar garantir que expiration_date é um objeto Date:
    // if (rows[0] && typeof rows[0].expiration_date === 'string') {
    //    rows[0].expiration_date = new Date(rows[0].expiration_date);
    // }

    return rows[0] as unknown as ConfirmedPhone;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCodeConfirmed(id: number) {
  const query = `
    DELETE FROM confirmed_phone WHERE id = ?
  `;
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteExpiredConfirmed() {
  // CURDATE() é a função MySQL equivalente a CURRENT_DATE (embora CURRENT_DATE também funcione)
  const query = `
    DELETE FROM confirmed_phone WHERE expiration_date < NOW()
  `;
  try {
    await pool.query(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
