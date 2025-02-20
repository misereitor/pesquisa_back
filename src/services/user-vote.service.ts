import {
  getUserVoteFromCPFByAdmin,
  updatePhoneUserVote
} from '../repository/user-vote';

export async function getUserVoteByCPF(cpf: string) {
  const userVote = await getUserVoteFromCPFByAdmin(cpf);
  if (userVote) {
    return userVote;
  }
  return false;
}

export async function alterPhoneByUserId(phone: string, id: number) {
  await updatePhoneUserVote(phone, id);
}
