import { Login, UserAdmin } from '../model/user-admin';
import {
  createUserAdmin,
  getAllUserAdmin,
  getPasswordMaster,
  getUserAdminByUsername,
  updatePasswordUserAdmin,
  updateUserAdmin
} from '../repository/user-admin';
import { createTokenUserAdmin } from '../security/token-user-admin.security';
import * as bcrypt from 'bcrypt';
import { schemaAddUserAdmin } from '../schema/user-admin';
import { AppError } from '../util/errorHandler';

export async function getAllUserAdminService() {
  const users = await getAllUserAdmin();
  return users;
}

export async function loginUserAdminService(login: Login) {
  const user = await checksUser(login.username);
  if (!user) {
    throw new AppError('Login ou senha inválidos', 404);
  }
  await chackPassword(user, login.password);
  const token = createTokenUserAdmin(user);
  user.password = '';
  const data = {
    user,
    token
  };
  return data;
}

export async function registerUserService(userAdmin: UserAdmin) {
  const user = await checksUser(userAdmin.username);
  if (user && user.active) {
    throw new AppError('Usuário já criado', 302);
  }
  schemaAddUserAdmin.parse(userAdmin);
  const hashPassword = await bcrypt.hash(userAdmin.password, 10);
  if (!user) {
    userAdmin.password = hashPassword;
    console.log(userAdmin);
    const register = await createUserAdmin(userAdmin);
    register.password = '';
    return register;
  }
  const update = await updateUserAdmin(userAdmin);
  await updatePasswordUserAdmin(user.id, hashPassword);
  update.password = '';
  return update;
}

export async function checksUser(username: string) {
  const userAdmin = await getUserAdminByUsername(username);
  return userAdmin;
}

export async function checkMasterPassword(password: string) {
  const check = await getPasswordMaster(password);
  if (check.length > 0) {
    return true;
  }
  return false;
}

async function chackPassword(userAdmin: UserAdmin, password: string) {
  const isMatch = await bcrypt.compare(password, userAdmin.password);
  if (!isMatch) throw new AppError('Login ou senha inválidos', 404);
}
