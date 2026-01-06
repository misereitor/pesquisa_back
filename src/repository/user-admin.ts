import pool from '../config/db';
import { UserAdmin } from '../model/user-admin';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// 1. Função auxiliar para converter 0/1 para boolean
const mapUserAdmin = (row: any): UserAdmin => {
  if (!row) return row;
  return {
    ...row,
    active: Boolean(row.active) // Converte 1 -> true, 0 -> false
  };
};

export async function createUserAdmin(user: UserAdmin) {
  const query = `
    INSERT INTO users_admin
      (name, username, password, email, role)
    VALUES
      (?, ?, ?, ?, ?)
  `;
  console.log(user.name, user.username, user.password, user.email, user.role);

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name,
      user.username,
      user.password,
      user.email,
      user.role
    ]);
    return { ...user, id: result.insertId, active: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserAdminById(id: number) {
  const query = 'SELECT * FROM users_admin WHERE id = ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    return mapUserAdmin(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserAdminByUsername(username: string) {
  const query = 'SELECT * FROM users_admin WHERE username LIKE ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [username]);

    return mapUserAdmin(rows[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUserAdmin() {
  const query = 'SELECT * FROM users_admin WHERE active = 1';
  try {
    const [rows] = await pool.query<RowDataPacket[]>(query);

    return rows.map(mapUserAdmin);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserAdmin(user: UserAdmin) {
  // MySQL não tem RETURNING *, então fazemos o update e retornamos o objeto que recebemos
  const query =
    'UPDATE users_admin SET name = ?, username = ?, email = ? WHERE id = ?';
  try {
    await pool.execute(query, [user.name, user.username, user.email, user.id]);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateRoleUserAdmin(id: number, role: string) {
  const query = 'UPDATE users_admin SET role = ? WHERE id = ?';
  try {
    await pool.execute(query, [role, id]);

    // Como alteramos apenas um campo e precisamos retornar o objeto completo, buscamos ele novamente
    return getUserAdminById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePasswordUserAdmin(id: number, password: string) {
  const query = 'UPDATE users_admin SET password = ? WHERE id = ?';
  try {
    await pool.execute(query, [password, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserAdminById(id: number) {
  // Soft delete: seta active para 0 (false)
  const query = 'UPDATE users_admin SET active = 0 WHERE id = ?';
  try {
    await pool.execute(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPasswordMaster(password: string) {
  const query = 'SELECT * from master_password WHERE password LIKE ?';
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [password]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
