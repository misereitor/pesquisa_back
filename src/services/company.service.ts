import { Company } from '../model/company';
import {
  associateCompany,
  createCompany,
  disableCompany,
  enableCompany,
  getAllCompany,
  getCompanyByTradeName,
  getCompanyById,
  updateCompany
} from '../repository/company';
import { createCompaniesBuildQuery } from '../util/query-builder';

export async function createCompanyService(company: Company) {
  if (company.cnpj && company.cnpj?.length > 1)
    company.cnpj = company.cnpj?.replace(/\D/g, '');
  const companyExist = await getCompanyByTradeName(company.trade_name);
  if (!companyExist) {
    return await createCompany(company);
  }
  if (!companyExist.active) {
    await enableCompany(companyExist.id);
    return await updateCompany(company);
  }
  company.id = companyExist.id;

  return await updateCompany(company);
}

export async function createCompaniesService(company: Company[]) {
  const createCompanies: Company[] = [];
  const allCompanies = [];
  const companies = await getAllCompany();
  for (let i = 0; i < company.length; i++) {
    if (company[i].cnpj?.length)
      company[i].cnpj = company[i].cnpj?.replace(/\D/g, '');

    const companyExistCompany = companies.find(
      (comp) => comp.company_name === company[i].company_name
    );
    if (companyExistCompany) allCompanies.push(companyExistCompany);
    if (!companyExistCompany) {
      createCompanies.push(company[i]);
    } else if (!companyExistCompany?.active) {
      await enableCompany(companyExistCompany.id);
      company[i].id = companyExistCompany.id;
      await updateCompany(company[i]);
    }
  }
  if (createCompanies.length === 0) return allCompanies;
  const id_create = await createCompaniesBuildQuery(createCompanies);
  allCompanies.push({ ...createCompanies, id: id_create });
  return allCompanies;
}

export async function getAllCompanyService() {
  const companies = await getAllCompany();
  return companies;
}

export async function getCompanyByIdService(id: number) {
  const Company = await getCompanyById(id);
  return Company;
}

export async function associateCompanyService(id: number, associate: boolean) {
  await associateCompany(id, associate);
}

export async function updateCompanyService(company: Company) {
  if (company.cnpj?.length) company.cnpj = company.cnpj.replace(/\D/g, '');
  const update = await updateCompany(company);
  return update;
}

export async function disableCompanyService(id: number) {
  await disableCompany(id);
}
