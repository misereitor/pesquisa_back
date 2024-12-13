import pool from '../config/db';
import { UserVote } from '../model/user-vote';
import { VotesConfirmed } from '../model/votes';

export async function createUserVote(user: UserVote) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO users_vote
      (name, phone, cpf, uf, city, last_ip, date_create)
        VALUES
      ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *
      `,
      values: [
        user.name,
        user.phone,
        user.cpf,
        user.uf,
        user.city,
        user.last_ip
      ],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getUserVoteById(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_vote WHERE id = ($1)',
      values: [id],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getAllUserVote() {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_vote'
    };
    const { rows } = await client.query(query);
    return rows as unknown as UserVote[];
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getUserVoteFromCPF(cpf: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_vote WHERE cpf = ($1)',
      values: [cpf],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getUserVoteFromPhone(phone: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_vote WHERE phone = ($1)',
      values: [phone],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateUserVote(user: UserVote) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_vote SET name = ($1), uf = ($2), city = ($3) WHERE id = ($4) RETURNING *',
      values: [user.name, user.uf, user.city, user.id],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateUserVotePhoneConfirmed(phone: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_vote SET confirmed_phone = true WHERE phone = ($1) RETURNING *',
      values: [phone],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserVote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateTrySendCode(user: UserVote) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_vote SET try_code_send = $1 WHERE id = ($2)',
      values: [user.try_code_send++, user.id],
      rowMode: 'single'
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateUserVoteAfterVoteConfirm(
  userVote: UserVote,
  votes: VotesConfirmed[]
) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      UPDATE users_vote
      SET 
        confirmed_vote = true, date_vote = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo',
        percentage_vote = $2, votes = $3
      WHERE ID = $1
      `,
      values: [userVote.id, userVote.percentage_vote, JSON.stringify(votes)]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getAllUserVoteVoted() {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_vote where confirmed'
    };
    const { rows } = await client.query(query);
    return rows as unknown as UserVote[];
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}
