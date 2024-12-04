import * as bcript from 'bcrypt';
import { Login, UserAdmin } from '../model/user-admin';
import {
  createUserAdmin,
  getUserAdminByUsername
} from '../repository/user-admin';
import { createTokenUserAdmin } from '../security/token-user-admin.security';
import * as bcrypt from 'bcrypt';
import { schemaAddUserAdmin } from '../schema/user-admin';

export async function loginUserAdminService(login: Login) {
  try {
    const user = await checksUser(login.username);
    if (!user) {
      throw new Error('Login ou senha inválidos');
    }
    await chackPassword(user, login.password);
    const token = createTokenUserAdmin(user);
    user.password = '';
    const data = {
      user,
      token
    };
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function registerUserService(userAdmin: UserAdmin) {
  try {
    const user = await checksUser(userAdmin.username);
    if (user) {
      throw new Error('Usuário já criado');
    }
    schemaAddUserAdmin.parse(userAdmin);
    const hashPassword = await bcrypt.hash(userAdmin.password, 10);
    userAdmin.password = hashPassword;
    const register = await createUserAdmin(userAdmin);
    register.password = '';
    return register;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function checksUser(username: string) {
  try {
    const userAdmin = await getUserAdminByUsername(username);
    return userAdmin;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function chackPassword(userAdmin: UserAdmin, password: string) {
  try {
    const isMatch = await bcript.compare(password, userAdmin.password);
    if (!isMatch) throw new Error('Login ou senha inválidos');
  } catch (error: any) {
    throw new Error(error.message);
  }
}
