import pool from '../config/db';
import { Company } from '../model/company';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function createCompany(company: Company) {
  // MySQL não suporta RETURNING *. Pegamos o ID gerado do resultado.
  const query = `
    INSERT INTO company
      (trade_name, company_name, cnpj, associate)
    VALUES
      (?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      company.trade_name,
      company.company_name,
      company.cnpj,
      company.associate
    ]);

    // Retornamos o objeto company com o novo ID inserido
    return { ...company, id: result.insertId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllCompany() {
  const query = 'SELECT * FROM company WHERE active = TRUE ORDER BY trade_name';
  try {
    // Use pool.query para SELECTs simples sem parâmetros
    const [rows] = await pool.query(query);
    return rows as unknown as Company[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCompanyById(id: number) {
  const query = 'SELECT * FROM company WHERE id = ? AND active = TRUE';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    return rows[0] as unknown as Company;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCompanyByTradeName(trade_name: string) {
  // 'like' funciona, mas '%' deve vir no valor ou na string, aqui assumindo que trade_name já tem os wildcards ou é match exato
  const query = 'SELECT * FROM company WHERE trade_name LIKE ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [trade_name]);
    return rows[0] as unknown as Company;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function associateCompany(id: number, associate: boolean) {
  const query = `
    UPDATE company 
      SET associate = ? 
    WHERE id = ?
  `;
  try {
    await pool.execute(query, [associate, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCompany(company: Company) {
  // Removemos o RETURNING *.
  const query = `
    UPDATE company 
    SET trade_name = ?, company_name = ?, cnpj = ?, associate = ? 
    WHERE id = ?
  `;
  try {
    await pool.execute(query, [
      company.trade_name,
      company.company_name,
      company.cnpj,
      company.associate,
      company.id
    ]);

    // Como já temos os dados atualizados no objeto 'company' recebido, retornamos ele mesmo.
    return company;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function disableCompany(id: number) {
  // Booleans no MySQL são 0 (false) e 1 (true), mas o driver converte TRUE/FALSE automaticamente na query string geralmente.
  // Para garantir, use 0 e 1 ou deixe o driver lidar.
  const query = 'UPDATE company SET active = FALSE WHERE id = ?';
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function enableCompany(id: number) {
  const query = 'UPDATE company SET active = TRUE WHERE id = ?';
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
