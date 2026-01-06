import pool from '../config/db';
import { Category } from '../model/category';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createCategory(category: Category) {
  // MySQL: Placeholders (?) e sem RETURNING *
  const query = `
    INSERT INTO category (name) VALUES (?)
  `;
  try {
    // Usamos ResultSetHeader para pegar o insertId
    const [result] = await pool.execute<ResultSetHeader>(query, [
      category.name
    ]);

    // Retornamos o objeto montado
    return { ...category, id: result.insertId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllCategory() {
  // MySQL: Substituído JSON_AGG/FILTER por Subquery + JSON_ARRAYAGG
  // Isso evita problemas com GROUP BY e NULLs no MySQL
  const query = `
    SELECT
      c.id,
      c.name,
      COALESCE(
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', co.id,
              'trade_name', co.trade_name,
              'company_name', co.company_name,
              'cnpj', co.cnpj,
              'associate', co.associate,
              'active', co.active
            )
          )
          FROM category_company_association cca
          JOIN company co ON cca.id_company = co.id
          WHERE cca.id_category = c.id AND co.active = TRUE
        ),
        JSON_ARRAY()
      ) AS companies
    FROM
      category c
    WHERE
      c.active = TRUE
    ORDER BY
      c.name;
  `;
  try {
    const [rows] = await pool.query(query);
    return rows as unknown as Category[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllCategoryByReportGeral() {
  const query = 'SELECT * FROM category ORDER BY name';
  try {
    const [rows] = await pool.query(query);
    return rows as unknown as Category[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCategoryById(id: number) {
  const query = 'SELECT * FROM category WHERE id = ? AND active = TRUE';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    return rows[0] as unknown as Category;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCategoryByName(name: string) {
  const query = 'SELECT * FROM category WHERE name LIKE ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [name]);
    return rows[0] as unknown as Category;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCategory(category: Category) {
  // MySQL: Placeholders (?) e sem RETURNING *
  const query = 'UPDATE category SET name = ? WHERE id = ?';
  try {
    await pool.execute(query, [category.name, category.id]);

    // Retornamos o objeto que recebemos, pois ele contém os dados atuais
    return category;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function disableCategory(id: number) {
  const query = 'UPDATE category SET active = FALSE WHERE id = ?';
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function enableCategory(id: number) {
  const query = 'UPDATE category SET active = TRUE WHERE id = ?';
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
