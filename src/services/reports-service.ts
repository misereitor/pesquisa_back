import { getAllCategoryByReportGeral } from '../repository/category';
import { getAllUserVote } from '../repository/user-vote';
import {
  getVotesByCategory,
  getCountVotesByUser,
  getTotalVotesByCity
} from '../repository/votes';
import {
  exportCSVCategoryReport,
  exportCSVCityReport,
  exportCSVGeral,
  exportCSVPercentagemReport
} from '../util/util-reports';

export async function getAllDataFromDashboard() {
  try {
    const [votesCategory, countVotes, usersVote, totalCity] = await Promise.all(
      [
        getAllDataReportCategory(),
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

export async function getAllDataReportGeral() {
  try {
    const [usersVote, categories] = await Promise.all([
      getAllUserVote(),
      getAllCategoryByReportGeral()
    ]);
    return { usersVote, categories };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportCategory() {
  try {
    const categories = await getVotesByCategory();
    const categoryTotal = categories.map((category) => {
      let total = 0;
      category.companies.forEach((company) => (total = total + company.value));
      category.total = total;
      return category;
    });
    return categoryTotal;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportCity() {
  try {
    const votingCity = await getTotalVotesByCity();
    return votingCity;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportPercentagem() {
  try {
    const usersVote = await getAllUserVote();
    return usersVote;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function downloadReportGeral() {
  try {
    const { categories, usersVote } = await getAllDataReportGeral();
    return exportCSVGeral(usersVote, categories);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function downloadReportCategory() {
  try {
    const categories = await getAllDataReportCategory();
    return exportCSVCategoryReport(categories);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function downloadReportCity() {
  try {
    const cities = await getAllDataReportCity();
    return exportCSVCityReport(cities);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function downloadReportPercentage() {
  try {
    const percentage = await getAllDataReportPercentagem();
    percentage.sort(
      (a, b) => (b.percentage_vote || 0) - (a.percentage_vote || 0)
    );
    return exportCSVPercentagemReport(percentage);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
