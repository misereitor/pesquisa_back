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
  const [votesCategory, countVotes, usersVote, totalCity] = await Promise.all([
    getAllDataReportCategory(),
    getCountVotesByUser(),
    getAllUserVote(),
    getTotalVotesByCity()
  ]);
  return { votesCategory, countVotes, usersVote, totalCity };
}

export async function getAllDataReportGeral() {
  const [usersVote, categories] = await Promise.all([
    getAllUserVote(),
    getAllCategoryByReportGeral()
  ]);
  return { usersVote, categories };
}

export async function getAllDataReportCategory() {
  const categories = await getVotesByCategory();
  const categoryTotal = categories.map((category) => {
    let total = 0;
    category.companies.forEach((company) => (total = total + company.value));
    category.total = total;
    return category;
  });
  return categoryTotal;
}

export async function getAllDataReportCity() {
  const votingCity = await getTotalVotesByCity();
  return votingCity;
}

export async function getAllDataReportPercentagem() {
  const usersVote = await getAllUserVote();
  return usersVote;
}

export async function downloadReportGeral() {
  const { categories, usersVote } = await getAllDataReportGeral();
  return exportCSVGeral(usersVote, categories);
}

export async function downloadReportCategory() {
  const categories = await getAllDataReportCategory();
  return exportCSVCategoryReport(categories);
}

export async function downloadReportCity() {
  const cities = await getAllDataReportCity();
  return exportCSVCityReport(cities);
}

export async function downloadReportPercentage() {
  const percentage = await getAllDataReportPercentagem();
  percentage.sort(
    (a, b) => (b.percentage_vote || 0) - (a.percentage_vote || 0)
  );
  return exportCSVPercentagemReport(percentage);
}
