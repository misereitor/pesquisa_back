import { UserAdmin } from '../model/user-admin';
import * as JWT from 'jsonwebtoken';

const { SECRET_KEY_ADMIN } = process.env;

export function createTokenUserAdmin(userAdmin: UserAdmin) {
  try {
    const token = JWT.sign(
      {
        id: userAdmin.id,
        username: userAdmin.username,
        roles: userAdmin.role
      },
      SECRET_KEY_ADMIN as string,
      {
        expiresIn: '30d'
      }
    );
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

type OpenToken = {
  id: number;
  username: string;
  roles: string;
};

export function openTokenUserAdmin(token: string | undefined) {
  try {
    const date = new Date();
    if (!token) throw new Error('Token invalid');
    const bearer = token.split(' ')[1];
    const decoded = JWT.verify(bearer, SECRET_KEY_ADMIN as string);
    if (decoded === null) throw new Error('Token invalid');
    if (typeof decoded === 'string') throw new Error('Token invalid');
    if (date.getTime() > Number(decoded.exp) * 1000)
      return new Error('Token expired');
    return decoded as OpenToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
