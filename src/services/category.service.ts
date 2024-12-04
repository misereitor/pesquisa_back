import { AssociationCompanyAndCategory } from '../model/association-company-category';
import { Category } from '../model/category';
import {
  getCategoryByName,
  createCategory,
  enableCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  disableCategory
} from '../repository/category';
import { queryCuston } from '../repository/custom-query';
import { createAssociationCategoriesBuildQuery } from '../util/query-builder';
import { createCompaniesService } from './company.service';

export async function createCategoryService(category: Category) {
  try {
    const categoryExist = await getCategoryByName(category.name);
    if (!categoryExist) {
      return await createCategory(category);
    }
    if (!categoryExist.active) {
      await enableCategory(categoryExist.id);
      return categoryExist;
    }
    return categoryExist;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createCategoriesService(
  categories: AssociationCompanyAndCategory[]
) {
  const categoryExist: AssociationCompanyAndCategory[] = [];
  const categoryNotExist: AssociationCompanyAndCategory[] = [];
  try {
    const categoriesInDB = await getAllCategory();
    for (const category of categories) {
      const exist = categoriesInDB.find((c) => c.name === category.name);
      if (exist) {
        category.id = exist.id;
        categoryExist.push(category);
      } else {
        categoryNotExist.push(category);
      }
    }
    await createCategoryExist(categoryExist);
    await createCategoryNotExist(categoryNotExist);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

async function createCategoryExist(category: AssociationCompanyAndCategory[]) {
  const association: any[] = [];
  for (const categ of category) {
    if (!categ.company) continue;
    const createCompanies = await createCompaniesService(categ.company);
    if (!createCompanies) continue;
    createCompanies.forEach((company) => {
      association.push({
        id_category: categ.id,
        id_company: company.id
      });
    });
  }
  if (association.length === 0) return;
  const queryCreateAssociation =
    createAssociationCategoriesBuildQuery(association);
  await queryCuston(queryCreateAssociation.text, []);
}

async function createCategoryNotExist(
  category: AssociationCompanyAndCategory[]
) {
  const association: any[] = [];
  for (const categ of category) {
    const create = await createCategory(categ);
    if (!categ.company) continue;
    const createCompanies = await createCompaniesService(categ.company);
    if (!createCompanies) continue;
    createCompanies.forEach((company) => {
      association.push({
        id_category: create.id,
        id_company: company.id
      });
    });
  }
  if (association.length === 0) return;
  const queryCreateAssociation =
    createAssociationCategoriesBuildQuery(association);
  await queryCuston(queryCreateAssociation.text, []);
}

export async function getAllCategoryService() {
  try {
    const categories = await getAllCategory();
    return categories;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getCategoryByIdService(id: number) {
  try {
    const category = await getCategoryById(id);
    return category;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateCategoryService(category: Category) {
  try {
    const update = await updateCategory(category);
    return update;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function disableCategoryService(id: number) {
  try {
    await disableCategory(id);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
