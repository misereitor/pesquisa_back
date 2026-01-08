import * as JWT from 'jsonwebtoken';

export function valideTokenUserVoteService(token: string | undefined) {
  try {
    const secret = process.env.SECRET_KEY_VOTING;
    if (!secret) throw new Error('SECRET_KEY_VOTING is not defined');

    if (!token) throw new Error('Token invalid');
    const date = new Date();
    const bearer = token.split(' ')[1];
    const decoded = JWT.verify(bearer, secret);
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
  const secret = process.env.SECRET_KEY_VOTING;
  if (!secret) throw new Error('SECRET_KEY_VOTING is not defined');

  const token = JWT.sign({ phone, id }, secret, {
    expiresIn: '24h'
  });
  return token;
}
