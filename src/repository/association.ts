import pool from '../config/db';
import {
  AssociationCompanyAndCategory,
  ImportCSV
} from '../model/association-company-category';

export async function createAssociationCategory(
  id_category: number,
  id_company: number
) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO category_company_association
        (id_category, id_company)
      VALUES
        ($1, $2) 
      ON CONFLICT DO NOTHING
      `,
      values: [id_category, id_company],
      rowMode: 'single'
    };
    await client.query(query);
  } finally {
    client.release();
  }
}

export async function importCSV(data: ImportCSV) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insere ou encontra a empresa
    const companyQuery = `
      INSERT INTO company (trade_name, company_name, cnpj, associate)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (trade_name) DO UPDATE
      SET company_name = EXCLUDED.company_name,
          cnpj = EXCLUDED.cnpj,
          associate = EXCLUDED.associate
      RETURNING id;
    `;
    const companyValues = [
      data.trade_name,
      data.company_name,
      data.cnpj,
      data.associate
    ];
    const companyResult = await client.query(companyQuery, companyValues);
    const companyId = companyResult.rows[0].id;

    // Itera pelas categorias e cria associações
    if (data.category && data.category.length > 0) {
      for (const categoryName of data.category) {
        // Insere ou encontra a categoria
        const categoryQuery = `
          INSERT INTO category (name)
          VALUES ($1)
          ON CONFLICT (name) DO NOTHING
          RETURNING id;
        `;
        const categoryResult = await client.query(categoryQuery, [
          categoryName
        ]);

        let categoryId: number;
        if (categoryResult.rows.length > 0) {
          categoryId = categoryResult.rows[0].id;
        } else {
          const selectCategoryQuery = `SELECT id FROM category WHERE name = $1`;
          const selectCategoryResult = await client.query(selectCategoryQuery, [
            categoryName
          ]);
          categoryId = selectCategoryResult.rows[0].id;
        }

        // Cria associação
        const associationQuery = `
          INSERT INTO category_company_association (id_category, id_company)
          VALUES ($1, $2)
          ON CONFLICT (id_category, id_company) DO NOTHING;
        `;
        await client.query(associationQuery, [categoryId, companyId]);
      }
    }

    await client.query('COMMIT');
  } catch (e: any) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getAllAssociation() {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT
        c.id AS id,
        c.name AS name,
        c.active AS active,
        c.date_create AS date_create,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', co.id,
              'trade_name', co.trade_name,
              'company_name', co.company_name,
              'cnpj', co.cnpj,
              'associate', co.associate,
              'active', co.active,
              'date_create', co.date_create
            )
          ) FILTER (WHERE co.id IS NOT NULL),
          '[]'
        ) AS companies
      FROM category c
      LEFT JOIN category_company_association cca
        ON c.id = cca.id_category
      LEFT JOIN company co
        ON co.id = cca.id_company
      GROUP BY c.id, c.name, c.active, c.date_create;
      `
    };
    const { rows } = await client.query(query);
    return rows as unknown as AssociationCompanyAndCategory[];
  } finally {
    client.release();
  }
}

export async function getAssociationByCategoryId(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      SELECT
        c.id AS id,
        c.name AS name,
        c.active AS active,
        c.date_create AS date_create,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', co.id,
              'trade_name', co.trade_name,
              'company_name', co.company_name,
              'cnpj', co.cnpj,
              'associate', co.associate,
              'active', co.active,
              'date_create', co.date_create
            )
          ) FILTER (WHERE co.id IS NOT NULL),
          '[]'
        ) AS companies
      FROM category c
      LEFT JOIN category_company_association cca
        ON c.id = cca.id_category
      LEFT JOIN company co
        ON co.id = cca.id_company
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.active, c.date_create;
      `,
      values: [id],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as AssociationCompanyAndCategory;
  } finally {
    client.release();
  }
}

export async function deleteAssociation(
  id_category: number,
  id_company: number
) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      DELETE FROM category_company_association WHERE id_category = $1 and id_company = $2
      `,
      values: [id_category, id_company]
    };
    await client.query(query);
  } finally {
    client.release();
  }
}
