import pool from '../config/db';
import {
  AssociationCompanyAndCategory,
  ImportCSV
} from '../model/association-company-category';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Função auxiliar para converter tipos MySQL para o modelo da Aplicação
const mapAssociation = (row: any): AssociationCompanyAndCategory => {
  return {
    ...row,
    active: Boolean(row.active), // Converte 1/0 para true/false
    // Se companies vier como string (comum em subqueries JSON), faz o parse
    companies:
      typeof row.companies === 'string'
        ? JSON.parse(row.companies)
        : row.companies || []
  };
};

export async function createAssociationCategory(
  id_category: number,
  id_company: number
) {
  const query = `
    INSERT IGNORE INTO category_company_association
      (id_category, id_company)
    VALUES
      (?, ?) 
  `;
  try {
    await pool.execute(query, [id_category, id_company]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function importCSV(data: ImportCSV) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // --- 1. Empresa ---
    let companyId: number;
    const insertCompanyQuery = `
      INSERT INTO company (trade_name, company_name, cnpj, associate)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          company_name = VALUES(company_name),
          cnpj = VALUES(cnpj),
          associate = VALUES(associate)
    `;

    const [companyResult] = await connection.execute<ResultSetHeader>(
      insertCompanyQuery,
      [data.trade_name, data.company_name, data.cnpj, data.associate]
    );

    if (companyResult.insertId > 0) {
      companyId = companyResult.insertId;
    } else {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM company WHERE trade_name = ?',
        [data.trade_name]
      );
      companyId = rows[0].id;
    }

    // --- 2. Categorias ---
    if (data.category && data.category.length > 0) {
      for (const categoryName of data.category) {
        const insertCategoryQuery = `INSERT IGNORE INTO category (name) VALUES (?)`;
        const [catResult] = await connection.execute<ResultSetHeader>(
          insertCategoryQuery,
          [categoryName]
        );

        let categoryId: number;
        if (catResult.insertId > 0) {
          categoryId = catResult.insertId;
        } else {
          const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT id FROM category WHERE name = ?',
            [categoryName]
          );
          categoryId = rows[0].id;
        }

        const associationQuery = `
          INSERT IGNORE INTO category_company_association (id_category, id_company)
          VALUES (?, ?)
        `;
        await connection.execute(associationQuery, [categoryId, companyId]);
      }
    }

    await connection.commit();
  } catch (e: any) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function getAllAssociation() {
  const query = `
    SELECT
      c.id AS id,
      c.name AS name,
      c.active AS active,
      c.date_create AS date_create,
      COALESCE(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', co.id,
                    'trade_name', co.trade_name,
                    'company_name', co.company_name,
                    'cnpj', co.cnpj,
                    'associate', co.associate,
                    'active', co.active,
                    'date_create', co.date_create
                )
            )
            FROM category_company_association cca
            JOIN company co ON co.id = cca.id_company
            WHERE cca.id_category = c.id
        ),
        JSON_ARRAY()
      ) AS companies
    FROM category c
    ORDER BY c.id;
  `;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);

    // Mapeia cada linha para corrigir os tipos
    return rows.map(mapAssociation);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAssociationByCategoryId(id: number) {
  const query = `
    SELECT
      c.id AS id,
      c.name AS name,
      c.active AS active,
      c.date_create AS date_create,
      COALESCE(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', co.id,
                    'trade_name', co.trade_name,
                    'company_name', co.company_name,
                    'cnpj', co.cnpj,
                    'associate', co.associate,
                    'active', co.active,
                    'date_create', co.date_create
                )
            )
            FROM category_company_association cca
            JOIN company co ON co.id = cca.id_company
            WHERE cca.id_category = c.id
        ),
        JSON_ARRAY()
      ) AS companies
    FROM category c
    WHERE c.id = ?
  `;
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (!rows[0]) return null as unknown as AssociationCompanyAndCategory;
    return mapAssociation(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAssociation(
  id_category: number,
  id_company: number
) {
  const query = `
    DELETE FROM category_company_association WHERE id_category = ? and id_company = ?
  `;
  try {
    await pool.execute(query, [id_category, id_company]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
