import { CategoryVotes, GraphReport, TotalCountForUser } from '../model/votes';
import { getAllCategoryByReportGeral } from '../repository/category';
import {
  getAllPorcentageByUserVote,
  getAllUserVote,
  getAllUserVoteForTime,
  getAllUserVotePagination,
  getTotalCountForUser
} from '../repository/user-vote';
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
    getAllUserVoteForTime(),
    getTotalVotesByCity()
  ]);
  const graphReport = graphReportMount(votesCategory, countVotes);
  return { votesCategory, countVotes, usersVote, totalCity, graphReport };
}

export async function getAllGraphReport() {
  const [votesCategory, countVotes] = await Promise.all([
    getAllDataReportCategory(),
    getCountVotesByUser()
  ]);
  const graphReport = graphReportMount(votesCategory, countVotes);
  return graphReport;
}

const graphReportMount = (
  votesCategory: CategoryVotes[],
  countVotes: TotalCountForUser
) => {
  const graphReport: GraphReport[] = votesCategory.map((e) => {
    const companies = e.companies.sort((a, b) => b.value - a.value);
    const filterCompany = companies.slice(0, 3);
    const outerCompany = companies.slice(3);
    const data = filterCompany.map((e) => {
      const dataFilter = {
        name: e.name,
        value: e.value
      };
      return dataFilter;
    });
    const blankVotes = {
      name: 'Brancos',
      value: countVotes.total_confirmed_true - e.total
    };
    const outer = {
      name: 'Outros',
      value: 0
    };
    outerCompany.forEach((e) => (outer.value += e.value));
    data.push(outer);
    data.push(blankVotes);
    const res = {
      category_name: e.category_name,
      companies: data
    };
    return res;
  });
  return graphReport;
};

export async function getAllDataReportGeral(limit: number, offset: number) {
  const [usersVote, categories, totalUser] = await Promise.all([
    getAllUserVotePagination(limit, offset),
    getAllCategoryByReportGeral(),
    getTotalCountForUser()
  ]);
  return { usersVote, categories, total: totalUser.total };
}

export async function getAllDataReportGeralDownload() {
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
  const usersVote = await getAllPorcentageByUserVote();
  return usersVote;
}

export async function downloadReportGeral() {
  const { categories, usersVote } = await getAllDataReportGeralDownload();
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
