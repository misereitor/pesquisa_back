import { Company } from '../model/company';
import {
  associateCompany,
  createCompany,
  disableCompany,
  enableCompany,
  getAllCompany,
  getCompanyByCompany_name,
  getCompanyById,
  updateCompany
} from '../repository/company';
import { queryCuston } from '../repository/custom-query';
import { createCompaniesBuildQuery } from '../util/query-builder';

export async function createCompanyService(company: Company) {
  try {
    if (company.cnpj.length > 1) company.cnpj = company.cnpj.replace(/\D/g, '');
    const companyExist = await getCompanyByCompany_name(company.company_name);
    if (!companyExist) {
      return await createCompany(company);
    }
    if (!companyExist.active) {
      await enableCompany(companyExist.id);
      return await updateCompany(company);
    }
    company.id = companyExist.id;

    return await updateCompany(company);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createCompaniesService(company: Company[]) {
  const createCompanies: Company[] = [];
  const allCompanies = [];
  const companies = await getAllCompany();
  try {
    for (let i = 0; i < company.length; i++) {
      if (company[i].cnpj.length)
        company[i].cnpj = company[i].cnpj.replace(/\D/g, '');

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
    const query = createCompaniesBuildQuery(createCompanies);
    const { rows } = await queryCuston(query.text, []);
    allCompanies.push(...rows);
    return allCompanies;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAllCompanyService() {
  try {
    const companies = await getAllCompany();
    return companies;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getCompanyByIdService(id: number) {
  try {
    const Company = await getCompanyById(id);
    return Company;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function associateCompanyService(id: number, associate: boolean) {
  try {
    await associateCompany(id, associate);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateCompanyService(company: Company) {
  try {
    if (company.cnpj.length) company.cnpj = company.cnpj.replace(/\D/g, '');
    const update = await updateCompany(company);
    return update;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function disableCompanyService(id: number) {
  try {
    await disableCompany(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
