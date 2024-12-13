import { UserVote } from '../model/user-vote';
import { Vote, VotesConfirmed } from '../model/votes';
import { getAllCategory } from '../repository/category';
import { getAllCompany } from '../repository/company';
import { getAllDictionaryEntries } from '../repository/dictionary';
import {
  getAllUserVote,
  updateUserVoteAfterVoteConfirm
} from '../repository/user-vote';
import {
  getVoteInCacheById,
  updateVoteInCache,
  createVoteInCache,
  getAllVotesInCache,
  confirmVote,
  deleteVoteInCache,
  getAllVotesConfirmedFromUser,
  batchInsertVotesFromVotes,
  getVotesByCategory,
  getCountVotesByUser,
  incrementVoteForCity,
  getTotalVotesByCity
} from '../repository/votes';

export async function getAllDataForVoteService(id: number) {
  try {
    const [companiesData, categoriesData, userVotesData, dictionaryData] =
      await Promise.all([
        getAllCompany(),
        getAllCategory(),
        getAllVotesInCache(id),
        getAllDictionaryEntries()
      ]);
    return { companiesData, categoriesData, userVotesData, dictionaryData };
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
    await batchInsertVotesFromVotes(votes);
    await incrementVoteForCity(userVote.city);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAllDataFromDashboard() {
  try {
    const [votesCategory, countVotes, usersVote, totalCity] = await Promise.all(
      [
        getVotesByCategory(),
        getCountVotesByUser(),
        getAllUserVote(),
        getTotalVotesByCity()
      ]
    );
    return { votesCategory, countVotes, usersVote, totalCity };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
