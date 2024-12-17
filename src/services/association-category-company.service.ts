import { ImportCSV } from '../model/association-company-category';
import {
  createAssociationCategory,
  getAllAssociation,
  getAssociationByCategoryId,
  deleteAssociation,
  importCSV
} from '../repository/association';

export async function createAssociationByCategoryService(
  id_category: number,
  id_company: number
) {
  await createAssociationCategory(id_category, id_company);
}

export async function createAssociationByCategoryArrayService(
  association: ImportCSV[]
) {
  const promises = association.map(async (ass) => await importCSV(ass));
  await Promise.all(promises);
}

export async function getAllAssociationService() {
  const associate = await getAllAssociation();
  return associate;
}

export async function getAssociationByCategoryIdService(id_category: number) {
  const associate = await getAssociationByCategoryId(id_category);
  return associate;
}

export async function deleteAssociationService(
  id_category: number,
  id_company: number
) {
  await deleteAssociation(id_category, id_company);
}
