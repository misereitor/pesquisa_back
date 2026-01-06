import pool from '../config/db';
import { UserVote } from '../model/user-vote';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Função auxiliar para corrigir tipos do UserVote
const mapUserVote = (row: any): UserVote => {
  if (!row) return row;
  return {
    ...row,
    // MySQL retorna TINYINT (0 ou 1), converte para Boolean
    confirmed_vote: Boolean(row.confirmed_vote),
    confirmed_phone: Boolean(row.confirmed_phone),
    // Garante que o campo JSON seja um objeto/array e não string
    votes: typeof row.votes === 'string' ? JSON.parse(row.votes) : row.votes
  };
};

export async function createUserVote(user: UserVote) {
  const query = `
    INSERT INTO users_vote
    (name, phone, cpf, country, state, city)
    VALUES
    (?, ?, ?, ?, ?, ?)
  `;
  console.log(user);
  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name,
      user.phone,
      user.cpf,
      user.country,
      user.state,
      user.city
    ]);

    // Retornamos o objeto user original atualizado com o ID (os booleanos já estão corretos na entrada)
    return { ...user, id: result.insertId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVoteById(id: number) {
  const query = 'SELECT * FROM users_vote WHERE id = ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    return mapUserVote(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUserVote() {
  const query = 'SELECT * FROM users_vote ORDER BY name';
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows.map(mapUserVote);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllPorcentageByUserVote() {
  // Aqui retorna só parciais, então não precisa de mapeamento completo,
  // mas se tiver campos booleanos no futuro, use o map.
  const query =
    'SELECT id, name, percentage_vote FROM users_vote ORDER BY name';
  try {
    const [rows] = await pool.query(query);
    return rows as unknown as UserVote[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUserVotePagination(limit: number, offset: number) {
  const query = 'SELECT * FROM users_vote ORDER BY name LIMIT ? OFFSET ?';
  try {
    // Atenção: Limit e Offset precisam ser passados como Number ou String numérica
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      limit.toString(),
      offset.toString()
    ]);
    return rows.map(mapUserVote);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTotalCountForUser() {
  // MySQL retorna number para COUNT, Postgres retornava string.
  const query = 'SELECT COUNT(ID) AS total FROM users_vote';
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows[0] as unknown as { total: number };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUserVoteForTime() {
  const query = 'SELECT date_vote FROM users_vote';
  try {
    const [rows] = await pool.query(query);
    return rows as unknown as UserVote[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVoteFromCPF(cpf: string) {
  const query = 'SELECT * FROM users_vote WHERE cpf = ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [cpf]);
    return mapUserVote(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVoteFromCPFByAdmin(cpf: string) {
  const query =
    'SELECT id, name, phone, cpf, confirmed_phone, confirmed_vote FROM users_vote WHERE cpf = ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [cpf]);
    return mapUserVote(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserVoteFromPhone(phone: string) {
  const query = 'SELECT * FROM users_vote WHERE phone = ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [phone]);
    return mapUserVote(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserVote(user: UserVote) {
  const query =
    'UPDATE users_vote SET name = ?, country = ?, state = ?, city = ? WHERE id = ?';
  try {
    await pool.execute(query, [
      user.name,
      user.country,
      user.state,
      user.city,
      user.id
    ]);
    // Retorna o próprio objeto enviado, assumindo que ele está com os dados corretos
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserVotePhoneConfirmed(phone: string) {
  const query = 'UPDATE users_vote SET confirmed_phone = 1 WHERE phone = ?';
  try {
    await pool.execute(query, [phone]);

    // Busca o usuário atualizado para retornar os dados corretos do banco
    return getUserVoteFromPhone(phone);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePhoneUserVote(phone: string, id: number) {
  const query = 'UPDATE users_vote SET phone = ? WHERE id = ?';
  try {
    await pool.execute(query, [phone, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTrySendCode(user: UserVote) {
  const query = 'UPDATE users_vote SET try_code_send = ? WHERE id = ?';
  try {
    await pool.execute(query, [user.try_code_send + 1, user.id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserVoteAfterVoteConfirm(userVote: UserVote) {
  const query = `
    UPDATE users_vote
    SET 
      confirmed_vote = 1, 
      date_vote = NOW(),
      percentage_vote = ? 
    WHERE id = ?
  `;
  try {
    // Converte o array de votos para string JSON explicitamente
    await pool.execute(query, [userVote.percentage_vote, userVote.id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUserVoteVoted() {
  const query = 'SELECT * FROM users_vote where confirmed_vote = 1';
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows.map(mapUserVote);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
