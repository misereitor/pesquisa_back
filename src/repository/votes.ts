import pool from '../config/db';
import { Vote, VotesConfirmed } from '../model/votes';

export async function createVoteInCache(vote: Vote) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO vote_not_confirmed
      (id_user_vote, id_category, id_company)
        VALUES
      ($1, $2, $3)
      `,
      values: [vote.id_user_vote, vote.id_category, vote.id_company]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getAllVotesInCache(id_user_vote: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT * FROM vote_not_confirmed WHERE id_user_vote = $1
      `,
      values: [id_user_vote]
    };
    const { rows } = await client.query(query);
    return rows as unknown as Vote[];
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getVoteInCacheById(vote: Vote) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT * FROM vote_not_confirmed WHERE id_user_vote = $1 AND id_category = $2
      `,
      values: [vote.id_user_vote, vote.id_category],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as Vote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateVoteInCache(vote: Vote) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      UPDATE vote_not_confirmed SET id_company = $3 WHERE id_user_vote = $1 AND id_category = $2
      `,
      values: [vote.id_user_vote, vote.id_category, vote.id_company]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function confirmVote(id_user_vote: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO votes
      SELECT * FROM vote_not_confirmed WHERE id_user_vote = $1 RETURNING *
      `,
      values: [id_user_vote]
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as Vote;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function deleteVoteInCache(id_user_vote: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      DELETE FROM vote_not_confirmed WHERE id_user_vote = $1
      `,
      values: [id_user_vote]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getAllVotesConfirmedFromUser(id_user_vote: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT 
        v.id_category, 
        v.id_company, 
        c.company_name, 
        cat.name as category_name
      FROM 
        votes v
      JOIN 
        company c ON v.id_company = c.id
      JOIN 
        category cat ON v.id_category = cat.id
      WHERE 
        v.id_user_vote = $1;
      `,
      values: [id_user_vote]
    };
    const { rows } = await client.query(query);
    return rows as unknown as VotesConfirmed[];
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}
