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
  const hashPassword = await bcrypt.hash(password, 10);
  await updatePasswordUserAdmin(id, hashPassword);
}

export async function alterProfileUserAdminService(
  id: number,
  userAdmin: UserAdmin
) {
  const user = await checksUser(userAdmin.username);
  if (user && user.id !== id) {
    throw new Error('Usuário já criado');
  }
  userAdmin.id = id;
  const updateUser = updateUserAdmin(userAdmin);
  return updateUser;
}

export async function alterRoleUserAdminService(id: number, role: string) {
  await updateRoleUserAdmin(id, role);
}

export async function deleteUserAdminService(id: number) {
  await deleteUserAdminById(id);
}
