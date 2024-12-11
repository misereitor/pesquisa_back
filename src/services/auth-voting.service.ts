import { UserVote } from '../model/user-vote';
import { queryCuston } from '../repository/custom-query';
import {
  deleteCodeConfirmed,
  getConfirmationUserVote
} from '../repository/login-user-vote';
import {
  createUserVote,
  getUserVoteFromCPF,
  getUserVoteFromPhone,
  updateTrySendCode,
  updateUserVotePhoneConfirmed
} from '../repository/user-vote';
import { schemaUserVote } from '../schema/user-vote';
import { createTokenUserVoting } from '../security/token-user-vote.security';
import { buildUpdateQuery } from '../util/query-builder';
import { createCode, sendMessage } from './whatsapp-sms.service';

export async function checkUserRegistred(cpf: string) {
  try {
    const userVote = await getUserVoteFromCPF(cpf);
    if (userVote) {
      if (userVote.confirmed_vote) throw new Error('CPF já confirmou o voto');
      const code = await createCode(userVote);
      await sendMessage(code, userVote.phone);
      await updateTrySendCode(userVote);
      return userVote;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createUserAndSendMessage(user: UserVote) {
  try {
    schemaUserVote.parse(user);
    let userVote: UserVote;
    const checksUser = await checksUserExistsAndDataIsTrue(user);
    if (checksUser) {
      userVote = checksUser;
    } else {
      const createUser = await createUserVote(user);
      userVote = createUser;
    }
    const code = await createCode(userVote);
    await sendMessage(code, user.phone);
    await updateTrySendCode(userVote);
    return userVote;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function checksUserExistsAndDataIsTrue(user: UserVote) {
  try {
    const getFromCPF = await getUserVoteFromCPF(user.cpf);
    const getFromPhone = await getUserVoteFromPhone(user.phone);

    if (getFromCPF && getFromCPF.confirmed_vote) {
      throw new Error('CPF informado já confirmou voto');
    }
    if (getFromPhone && getFromPhone.confirmed_vote) {
      throw new Error('Telefone informado já confirmou voto');
    }

    if (
      getFromCPF &&
      getFromCPF.phone !== user.phone &&
      getFromCPF.confirmed_phone
    ) {
      throw new Error('CPF informado já está em uso');
    }
    if (
      getFromPhone &&
      getFromPhone.cpf !== user.cpf &&
      getFromPhone.confirmed_phone
    ) {
      throw new Error('Telefone informado já está em uso');
    }
    if (getFromCPF) {
      user.id = getFromCPF.id;
      return await updateUser(user);
    }
    if (getFromPhone) {
      user.id = getFromPhone.id;
      return await updateUser(user);
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function confirmCode(code: string, phone: string) {
  try {
    const valide = await valideCode(code, phone);
    const deleteCode = await deleteCodeConfirmed(valide.id);
    const confirmUserCode = await updateUserVotePhoneConfirmed(phone);
    const gerateToken = createTokenUserVoting(phone, confirmUserCode.id);
    await Promise.all([valide, gerateToken, deleteCode, confirmUserCode]);
    const login = {
      token: gerateToken,
      user: confirmUserCode
    };
    return login;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function valideCode(code: string, phone: string) {
  const getConfirmed = await getConfirmationUserVote(phone, code);
  if (!getConfirmed) {
    throw new Error('Código incorreto');
  }
  const date = new Date();
  const dateExpiration = new Date(getConfirmed.expiration_date);
  if (dateExpiration < date) {
    throw new Error('Código expirado' + dateExpiration);
  }
  return getConfirmed;
}

async function updateUser(user: UserVote) {
  const updateUser = buildUpdateQuery('users_vote', user);
  const { rows } = await queryCuston(updateUser.text, updateUser.values);
  return rows[0] as unknown as UserVote;
}
