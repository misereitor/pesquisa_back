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
  getAllVotesConfirmedFromUser
} from '../repository/votes';

export async function getAllDataForVoteService(id: number) {
  try {
    const [companiesData, categoriesData, userVotesData] = await Promise.all([
      getAllCompany(),
      getAllCategory(),
      getAllVotesInCache(id)
    ]);
    return { companiesData, categoriesData, userVotesData };
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createVoteInCacheService(vote: Vote) {
  try {
    const voteExist = await getVoteInCacheById(vote);
    if (voteExist) {
      await updateVoteInCache(vote);
    } else {
      await createVoteInCache(vote);
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAllVotesService(id_user_vote: number) {
  try {
    const votes = await getAllVotesInCache(id_user_vote);
    return votes;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function confirmVoteService(userVote: UserVote) {
  try {
    await confirmVote(userVote.id);
    await deleteVoteInCache(userVote.id);
    await updateVotesUserVoteConfirmation(userVote);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

async function updateVotesUserVoteConfirmation(userVote: UserVote) {
  try {
    const votes: VotesConfirmed[] = await getAllVotesConfirmedFromUser(
      userVote.id
    );

    await updateUserVoteAfterVoteConfirm(userVote, votes);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
