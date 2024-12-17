import pool from '../config/db';
import { DictionaryEntry } from '../model/dictionary';

export async function insertDictionaryEntry(entry: DictionaryEntry) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO substitution_dictionary (key_word, synonyms)
      VALUES ($1, $2) RETURNING *
      `,
      values: [entry.key_word, entry.synonyms]
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as DictionaryEntry[];
  } finally {
    client.release();
  }
}

export async function updateDictionaryEntry(entry: DictionaryEntry) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      UPDATE substitution_dictionary
      SET synonyms = $2
      WHERE key_word = $1
      `,
      values: [entry.key_word, entry.synonyms]
    };
    await client.query(query);
  } finally {
    client.release();
  }
}

export async function getAllDictionaryEntries() {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT * FROM substitution_dictionary ORDER BY key_word
      `
    };
    const { rows } = await client.query(query);
    return rows as DictionaryEntry[];
  } finally {
    client.release();
  }
}

export async function deleteDictionaryEntry(key_word: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      DELETE FROM substitution_dictionary
      WHERE key_word = $1
      `,
      values: [key_word]
    };
    await client.query(query);
  } finally {
    client.release();
  }
}
