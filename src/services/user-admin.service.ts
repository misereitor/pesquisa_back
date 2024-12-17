import { UserAdmin } from '../model/user-admin';
import {
  deleteUserAdminById,
  updatePasswordUserAdmin,
  updateRoleUserAdmin,
  updateUserAdmin
} from '../repository/user-admin';
import * as bcrypt from 'bcrypt';
import { checksUser } from './auth-admin.service';

export async function alterPasswordUserAdminService(
  id: number,
  password: string
) {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await updatePasswordUserAdmin(id, hashPassword);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function alterProfileUserAdminService(
  id: number,
  userAdmin: UserAdmin
) {
  try {
    const user = await checksUser(userAdmin.username);
    if (user && user.id !== id) {
      throw new Error('Usuário já criado');
    }
    userAdmin.id = id;
    const updateUser = updateUserAdmin(userAdmin);
    return updateUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function alterRoleUserAdminService(id: number, role: string) {
  try {
    await updateRoleUserAdmin(id, role);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteUserAdminService(id: number) {
  try {
    await deleteUserAdminById(id);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
