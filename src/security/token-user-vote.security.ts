import * as JWT from 'jsonwebtoken';

const { SECRET_KEY_VOTING } = process.env;

export function valideTokenUserVoteService(token: string | undefined) {
  try {
    if (!token) throw new Error('Token invalid');
    const date = new Date();
    const bearer = token.split(' ')[1];
    const decoded = JWT.verify(bearer, SECRET_KEY_VOTING as string);
    if (decoded === null) throw new Error('Token invalid');
    if (typeof decoded === 'string') throw new Error('Token invalid');
    if (date.getTime() > Number(decoded.exp) * 1000)
      return new Error('Token expired');
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function createTokenUserVoting(phone: string, id: number) {
  const token = JWT.sign({ phone, id }, SECRET_KEY_VOTING as string, {
    expiresIn: '24h'
  });
  return token;
}
