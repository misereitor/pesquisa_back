import pool from '../config/db';
import { Category } from '../model/category';

export async function createCategory(category: Category) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO category
        (name)
      VALUES
        ($1) RETURNING *
      `,
      values: [category.name],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as Category;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getAllCategory() {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM category WHERE active = TRUE'
    };

    const { rows } = await client.query(query);
    return rows as unknown as Category[];
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getCategoryById(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM category WHERE id = ($1) AND active = TRUE',
      values: [id],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as Category;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function getCategoryByName(name: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM category WHERE name like $1',
      values: [name],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as Category;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function updateCategory(category: Category) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE category SET name = $1 WHERE id = $2 RETURNING *',
      values: [category.name, category.id],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as Category;
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function disableCategory(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE category SET active = FALSE WHERE id = $1',
      values: [id]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}

export async function enableCategory(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE category SET active = TRUE WHERE id = $1',
      values: [id]
    };
    await client.query(query);
  } catch (e: any) {
    console.warn(e);
    throw new Error(e.message);
  } finally {
    client.release();
  }
}
