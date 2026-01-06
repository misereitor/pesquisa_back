import pool from '../config/db';
import {
  CategoryVotes,
  TotalCountForCity,
  TotalCountForUser,
  Vote,
  VotesConfirmed
} from '../model/votes';
import { RowDataPacket } from 'mysql2';

export async function createVoteInCache(vote: Vote) {
  const query = `
    INSERT INTO vote_not_confirmed
    (id_user_vote, id_category, id_company)
    VALUES
    (?, ?, ?)
  `;
  try {
    await pool.execute(query, [
      vote.id_user_vote,
      vote.id_category,
      vote.id_company
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllVotesInCache(id_user_vote: number) {
  const query = `
    SELECT * FROM vote_not_confirmed WHERE id_user_vote = ?
  `;
  try {
    const [rows] = await pool.execute(query, [id_user_vote]);
    return rows as unknown as Vote[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getVoteInCacheById(vote: Vote) {
  const query = `
    SELECT * FROM vote_not_confirmed WHERE id_user_vote = ? AND id_category = ? LIMIT 1
  `;
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      vote.id_user_vote,
      vote.id_category
    ]);
    return rows[0] as unknown as Vote;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateVoteInCache(vote: Vote) {
  const query = `
    UPDATE vote_not_confirmed SET id_company = ? WHERE id_user_vote = ? AND id_category = ?
  `;
  try {
    // Atenção à ordem dos parâmetros: id_company (SET), depois id_user_vote e id_category (WHERE)
    await pool.execute(query, [
      vote.id_company,
      vote.id_user_vote,
      vote.id_category
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function confirmVote(id_user_vote: number) {
  // MySQL usa ON DUPLICATE KEY UPDATE em vez de ON CONFLICT
  const query = `
    INSERT INTO votes (id_user_vote, id_category, id_company)
    SELECT id_user_vote, id_category, id_company
    FROM vote_not_confirmed
    WHERE id_user_vote = ?
    ON DUPLICATE KEY UPDATE 
      id_company = VALUES(id_company)
  `;
  try {
    await pool.execute(query, [id_user_vote]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteVoteInCache(id_user_vote: number) {
  const query = `
    DELETE FROM vote_not_confirmed WHERE id_user_vote = ?
  `;
  try {
    await pool.execute(query, [id_user_vote]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllVotesConfirmedFromUser(id_user_vote: number) {
  const query = `
    SELECT 
      v.id_category, 
      v.id_company, 
      c.trade_name, 
      cat.name as category_name
    FROM 
      votes v
    JOIN 
      company c ON v.id_company = c.id
    JOIN 
      category cat ON v.id_category = cat.id
    WHERE 
      v.id_user_vote = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [id_user_vote]);
    return rows as unknown as VotesConfirmed[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function incrementVoteForCity(city: string) {
  const query = `
    INSERT INTO voting_city (city, total_votes)
    VALUES (?, 1)
    ON DUPLICATE KEY UPDATE total_votes = total_votes + 1;
  `;
  try {
    await pool.execute(query, [city]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function batchInsertVotesFromVotes(votes: VotesConfirmed[]) {
  if (votes.length === 0) return;
  try {
    // Lógica de agregação (Mantida do original)
    const aggregatedVotes: {
      [key: string]: {
        id_category: number;
        id_company: number;
        total_votes: number;
      };
    } = {};

    for (const vote of votes) {
      const key = `${vote.id_category}-${vote.id_company}`;
      if (!aggregatedVotes[key]) {
        aggregatedVotes[key] = {
          id_category: vote.id_category,
          id_company: vote.id_company,
          total_votes: 1
        };
      } else {
        aggregatedVotes[key].total_votes += 1;
      }
    }

    const uniqueVotes = Object.values(aggregatedVotes);

    // No MySQL não precisamos de índices numéricos ($1, $2...), apenas '?' repetidos
    const placeholders = uniqueVotes.map(() => '(?, ?, ?)').join(', ');

    const query = `
    INSERT INTO category_votes (id_category, id_company, total_votes)
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE total_votes = category_votes.total_votes + VALUES(total_votes);
  `;

    const values = uniqueVotes.flatMap((vote) => [
      vote.id_category,
      vote.id_company,
      vote.total_votes
    ]);

    await pool.execute(query, values);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getVotesByCategory() {
  // Query reescrita para MySQL.
  // Substituímos JSON_AGG/FILTER (Postgres) por Subquery + JSON_ARRAYAGG (MySQL)
  const query = `
    SELECT 
      c.name AS category_name,
      COALESCE(
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'name', co.trade_name,
              'value', cv.total_votes
            )
          )
         FROM category_votes cv
         JOIN company co ON cv.id_company = co.id
         WHERE cv.id_category = c.id
        ),
        JSON_ARRAY()
      ) AS companies
    FROM 
      category c
    ORDER BY 
      c.name;
  `;
  try {
    const [rows] = await pool.query(query); // pool.query é melhor para selects complexos sem args
    return rows as unknown as CategoryVotes[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCountVotesByUser() {
  // Postgres usa FILTER (WHERE...), MySQL usa CASE WHEN
  const query = `
    SELECT
      COUNT(id) AS total_items,
      SUM(CASE WHEN confirmed_vote = 1 THEN 1 ELSE 0 END) AS total_confirmed_true,
      SUM(CASE WHEN confirmed_vote = 0 THEN 1 ELSE 0 END) AS total_confirmed_false,
      SUM(CASE WHEN percentage_vote >= 70 THEN 1 ELSE 0 END) AS total_percentage_above_70,
      SUM(CASE WHEN percentage_vote < 70 THEN 1 ELSE 0 END) AS total_percentage_below_70
    FROM users_vote;
  `;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows[0] as unknown as TotalCountForUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTotalVotesByCity() {
  const query = `
    SELECT city, total_votes AS total FROM voting_city ORDER BY total_votes DESC;
  `;
  try {
    const [rows] = await pool.query(query);
    return rows as unknown as TotalCountForCity[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
