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
import { customQuery } from '../repository/custom-query';
import { createAssociationCategoriesBuildQuery } from '../util/query-builder';
import { createCompaniesService } from './company.service';

export async function createCategoryService(category: Category) {
  const categoryExist = await getCategoryByName(category.name);
  if (!categoryExist) {
    return await createCategory(category);
  }
  if (!categoryExist.active) {
    await enableCategory(categoryExist.id);
    return categoryExist;
  }
  return categoryExist;
}

export async function createCategoriesService(
  categories: AssociationCompanyAndCategory[]
) {
  const categoryExist: AssociationCompanyAndCategory[] = [];
  const categoryNotExist: AssociationCompanyAndCategory[] = [];
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
}

async function createCategoryExist(category: AssociationCompanyAndCategory[]) {
  const association: any[] = [];

  // Mapear cada categ para uma promessa
  await Promise.all(
    category.map(async (categ) => {
      if (!categ.company) return;

      const createCompanies = await createCompaniesService(categ.company);
      if (!createCompanies) return;

      createCompanies.forEach((company) => {
        association.push({
          id_category: categ.id,
          id_company: company.id
        });
      });
    })
  );

  if (association.length === 0) return;
  const queryCreateAssociation =
    createAssociationCategoriesBuildQuery(association);
  await customQuery(queryCreateAssociation.text, []);
}

async function createCategoryNotExist(
  category: AssociationCompanyAndCategory[]
) {
  const association: any[] = [];

  // Mapear cada categ para uma promessa
  await Promise.all(
    category.map(async (categ) => {
      const create = await createCategory(categ);
      if (!categ.company) return;

      const createCompanies = await createCompaniesService(categ.company);
      if (!createCompanies) return;

      createCompanies.forEach((company) => {
        association.push({
          id_category: create.id,
          id_company: company.id
        });
      });
    })
  );

  if (association.length === 0) return;
  const queryCreateAssociation =
    createAssociationCategoriesBuildQuery(association);
  await customQuery(queryCreateAssociation.text, []);
}

export async function getAllCategoryService() {
  const categories = await getAllCategory();
  return categories;
}

export async function getCategoryByIdService(id: number) {
  const category = await getCategoryById(id);
  return category;
}

export async function updateCategoryService(category: Category) {
  const update = await updateCategory(category);
  return update;
}

export async function disableCategoryService(id: number) {
  await disableCategory(id);
}
