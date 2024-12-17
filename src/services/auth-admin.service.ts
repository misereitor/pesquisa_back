import { Login, UserAdmin } from '../model/user-admin';
import {
  createUserAdmin,
  getAllUserAdmin,
  getUserAdminByUsername,
  updatePasswordUserAdmin,
  updateUserAdmin
} from '../repository/user-admin';
import { createTokenUserAdmin } from '../security/token-user-admin.security';
import * as bcrypt from 'bcrypt';
import { schemaAddUserAdmin } from '../schema/user-admin';

export async function getAllUserAdminService() {
  try {
    const users = await getAllUserAdmin();
    return users;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

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
    if (user && user.active) {
      throw new Error('Usuário já criado');
    }

    schemaAddUserAdmin.parse(userAdmin);
    const hashPassword = await bcrypt.hash(userAdmin.password, 10);
    if (!user) {
      userAdmin.password = hashPassword;
      const register = await createUserAdmin(userAdmin);
      register.password = '';
      return register;
    }
    const update = await updateUserAdmin(userAdmin);
    await updatePasswordUserAdmin(user.id, hashPassword);
    update.password = '';
    return update;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function checksUser(username: string) {
  try {
    const userAdmin = await getUserAdminByUsername(username);
    return userAdmin;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function chackPassword(userAdmin: UserAdmin, password: string) {
  try {
    const isMatch = await bcrypt.compare(password, userAdmin.password);
    if (!isMatch) throw new Error('Login ou senha inválidos');
  } catch (error: any) {
    throw new Error(error.message);
  }
}
