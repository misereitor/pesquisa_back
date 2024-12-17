import pool from '../config/db';
import {
  CategoryVotes,
  TotalCountForCity,
  TotalCountForUser,
  Vote,
  VotesConfirmed
} from '../model/votes';

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
        INSERT INTO votes (id_user_vote, id_category, id_company)
        SELECT id_user_vote, id_category, id_company
        FROM vote_not_confirmed
        WHERE id_user_vote = $1
        ON CONFLICT (id_user_vote, id_category)
        DO UPDATE SET 
          id_company = EXCLUDED.id_company
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

export async function incrementVoteForCity(city: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
        INSERT INTO voting_city (city, total_votes)
        VALUES ($1, 1)
        ON CONFLICT (city)
        DO UPDATE SET total_votes = voting_city.total_votes + 1;
      `,
      values: [city]
    };
    await client.query(query);
  } catch (e: any) {
    console.error('Erro ao incrementar votos para a cidade:', e.message);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function batchInsertVotesFromVotes(votes: VotesConfirmed[]) {
  const client = await pool.connect();
  try {
    // Mapeia os votos para calcular o total de votos por categoria e empresa
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
          total_votes: 1 // Cada voto conta como 1
        };
      } else {
        aggregatedVotes[key].total_votes += 1;
      }
    }

    const uniqueVotes = Object.values(aggregatedVotes);

    const query = `
      INSERT INTO category_votes (id_category, id_company, total_votes)
      VALUES ${uniqueVotes
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(', ')}
      ON CONFLICT (id_category, id_company)
      DO UPDATE SET total_votes = category_votes.total_votes + EXCLUDED.total_votes;
    `;

    const values = uniqueVotes.flatMap((vote) => [
      vote.id_category,
      vote.id_company,
      vote.total_votes
    ]);

    await client.query(query, values);
  } catch (e: any) {
    console.error('Erro ao realizar inserção em massa:', e.message);
    throw e;
  } finally {
    client.release();
  }
}

export async function getVotesByCategory() {
  const client = await pool.connect();
  try {
    const query = `
    SELECT 
      c.name AS category_name,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', co.trade_name,
            'value', cv.total_votes
          )
        ) FILTER (WHERE co.id IS NOT NULL),
        '[]'::JSON
      ) AS companies
    FROM 
      category_votes cv
    JOIN 
      category c ON cv.id_category = c.id
    LEFT JOIN 
      company co ON cv.id_company = co.id
    GROUP BY 
      c.id
    ORDER BY 
      c.name;
    `;
    const { rows } = await client.query(query);
    return rows as unknown as CategoryVotes[];
  } catch (e) {
    console.error('Erro ao obter relatório por categoria:', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function getCountVotesByUser() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT
        COUNT(*) AS total_items,
        COUNT(*) FILTER (WHERE confirmed_vote = TRUE) AS total_confirmed_true,
        COUNT(*) FILTER (WHERE confirmed_vote = FALSE) AS total_confirmed_false,
        COUNT(*) FILTER (WHERE percentage_vote >= 70) AS total_percentage_above_70,
        COUNT(*) FILTER (WHERE percentage_vote < 70) AS total_percentage_below_70
      FROM users_vote;
    `;
    const { rows } = await client.query(query);
    return rows[0] as unknown as TotalCountForUser;
  } catch (e) {
    console.error('Erro ao obter relatório por categoria:', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function getTotalVotesByCity() {
  const client = await pool.connect();
  try {
    const query = {
      text: `
        SELECT city, total_votes AS total FROM voting_city ORDER BY total_votes DESC;
      `
    };
    const { rows } = await client.query(query);
    return rows as unknown as TotalCountForCity[];
  } catch (e: any) {
    console.error('Erro ao incrementar votos para a cidade:', e.message);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}
