import { UserVote } from '../model/user-vote';
import { Vote, VotesConfirmed } from '../model/votes';
import { getAllCategory } from '../repository/category';
import { getAllCompany } from '../repository/company';
import { updateUserVoteAfterVoteConfirm } from '../repository/user-vote';
import {
  getVoteInCacheById,
  updateVoteInCache,
  createVoteInCache,
  getAllVotesInCache,
  confirmVote,
  deleteVoteInCache,
  getAllVotesConfirmedFromUser,
  batchInsertVotesFromVotes,
  incrementVoteForCity
} from '../repository/votes';

export async function getAllDataForVoteService(id: number) {
  const [companiesData, categoriesData, userVotesData] = await Promise.all([
    getAllCompany(),
    getAllCategory(),
    getAllVotesInCache(id)
  ]);
  return { companiesData, categoriesData, userVotesData };
}

export async function createVoteInCacheService(vote: Vote) {
  const voteExist = await getVoteInCacheById(vote);
  if (voteExist) {
    await updateVoteInCache(vote);
  } else {
    await createVoteInCache(vote);
  }
}

export async function getAllVotesService(id_user_vote: number) {
  const votes = await getAllVotesInCache(id_user_vote);
  return votes;
}

export async function confirmVoteService(userVote: UserVote) {
  await confirmVote(userVote.id);
  await deleteVoteInCache(userVote.id);
  await updateVotesUserVoteConfirmation(userVote);
}

async function updateVotesUserVoteConfirmation(userVote: UserVote) {
  const votes: VotesConfirmed[] = await getAllVotesConfirmedFromUser(
    userVote.id
  );
  await updateUserVoteAfterVoteConfirm(userVote);
  await batchInsertVotesFromVotes(votes);
  await incrementVoteForCity(userVote.city);
}
