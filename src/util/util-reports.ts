import { Category } from '../model/category';
import { UserVote } from '../model/user-vote';
import { CategoryVotes, TotalCountForCity } from '../model/votes';
import { regexCPF, regexPhone } from './regex';
import { createArrayCsvStringifier } from 'csv-writer';

export const exportCSVGeral = (
  usersVote: UserVote[],
  categories: Category[]
) => {
  const header = [
    'Nome',
    'Votou',
    'Porcentagem',
    'CPF',
    'Telefone',
    'Estado',
    'Cidade',
    'Data de Cadastro',
    'Data do Voto',
    ...categories.map((category) => category.name)
  ];

  const csvStringifier = createArrayCsvStringifier({
    header // Define o cabeçalho
  });

  const csvData = usersVote.map((user) => {
    const rowData = [
      user.name,
      user.confirmed_vote ? 'SIM' : 'NÃO',
      user.percentage_vote ? `${Number(user.percentage_vote).toFixed(0)}%` : '',
      regexCPF(user.cpf),
      regexPhone(user.phone),
      user.uf,
      user.city,
      new Date(user.date_create)
        .toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
        .replace(',', ''),
      new Date(user.date_vote)
        .toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
        .replace(',', '')
    ];
    const categoryVotes = categories.map((category) => {
      const vote = user.votes.find((v) => v.id_category === category.id);
      return vote ? vote.company_name : '';
    });

    return [...rowData, ...categoryVotes];
  });

  const csvString =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);

  return csvString;
};

export const exportCSVCategoryReport = (categories: CategoryVotes[]) => {
  const header = [
    'Categoria',
    'Total de Votos Válidos',
    'Empresa',
    'Quantidade de Votos'
  ];

  const csvStringifier = createArrayCsvStringifier({
    header
  });

  const csvData = categories.flatMap((category) => {
    const rows: string[][] = [];

    rows.push([category.category_name, category.total.toString(), '', '']);

    category.companies.forEach((company) => {
      rows.push(['', '', company.name, company.value.toString()]);
    });

    return rows;
  });

  const csvString =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);

  return csvString;
};

export const exportCSVCityReport = (cities: TotalCountForCity[]) => {
  const header = ['Cidade', 'Total'];

  const csvStringifier = createArrayCsvStringifier({
    header
  });

  const csvData = cities.flatMap((city) => {
    const rows: string[][] = [];

    rows.push([city.city, city.total.toString()]);

    return rows;
  });

  const csvString =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);

  return csvString;
};

export const exportCSVPercentagemReport = (percentage: UserVote[]) => {
  const header = ['Nome', 'Porcentagem'];

  const csvStringifier = createArrayCsvStringifier({
    header
  });

  const csvData = percentage.flatMap((user) => {
    const rows: string[][] = [];

    rows.push([
      user.name,
      user.percentage_vote
        ? Number(user.percentage_vote).toFixed(0).toString()
        : ''
    ]);

    return rows;
  });

  const csvString =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);

  return csvString;
};
