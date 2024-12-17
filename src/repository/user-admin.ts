import pool from '../config/db';
import { UserAdmin } from '../model/user-admin';

export async function createUserAdmin(user: UserAdmin) {
  const client = await pool.connect();
  try {
    const query = {
      text: `
      INSERT INTO users_admin
        (name, username, password, email, last_ip, role)
      VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      values: [
        user.name,
        user.username,
        user.password,
        user.email,
        user.last_ip,
        user.role
      ],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserAdmin;
  } finally {
    client.release();
  }
}

export async function getUserAdminById(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_admin WHERE id = ($1)',
      values: [id],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as UserAdmin;
  } finally {
    client.release();
  }
}

export async function getUserAdminByUsername(username: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_admin WHERE username like $1',
      values: [username],
      rowMode: 'single'
    };

    const { rows } = await client.query(query);
    return rows[0] as unknown as UserAdmin;
  } finally {
    client.release();
  }
}

export async function getAllUserAdmin() {
  const client = await pool.connect();
  try {
    const query = {
      text: 'SELECT * FROM users_admin WHERE active = true'
    };
    const { rows } = await client.query(query);
    return rows as unknown as UserAdmin[];
  } finally {
    client.release();
  }
}

export async function updateUserAdmin(user: UserAdmin) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_admin SET name = $1, username = $2, email = $3 WHERE id = $4 RETURNING *',
      values: [user.name, user.username, user.email, user.id],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserAdmin;
  } finally {
    client.release();
  }
}

export async function updateRoleUserAdmin(id: number, role: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_admin SET role = $1 WHERE id = $2 RETURNING *',
      values: [role, id],
      rowMode: 'single'
    };
    const { rows } = await client.query(query);
    return rows[0] as unknown as UserAdmin;
  } finally {
    client.release();
  }
}

export async function updatePasswordUserAdmin(id: number, password: string) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_admin SET password = $1 WHERE id = $2',
      values: [password, id],
      rowMode: 'single'
    };
    await client.query(query);
  } finally {
    client.release();
  }
}

export async function deleteUserAdminById(id: number) {
  const client = await pool.connect();
  try {
    const query = {
      text: 'UPDATE users_admin SET active = false WHERE id = $1',
      values: [id]
    };
    await client.query(query);
  } finally {
    client.release();
  }
}
