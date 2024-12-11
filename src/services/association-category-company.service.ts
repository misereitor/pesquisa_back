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
  try {
    await createAssociationCategory(id_category, id_company);
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createAssociationByCategoryArrayService(
  association: ImportCSV[]
) {
  try {
    const promises = association.map(async (ass) => await importCSV(ass));
    await Promise.all(promises);
  } catch (e: any) {
    console.error('Erro ao processar array:', e.message);
    throw new Error(e.message);
  }
}

export async function getAllAssociationService() {
  try {
    const associate = await getAllAssociation();
    return associate;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getAssociationByCategoryIdService(id_category: number) {
  try {
    const associate = await getAssociationByCategoryId(id_category);
    return associate;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function deleteAssociationService(
  id_category: number,
  id_company: number
) {
  try {
    await deleteAssociation(id_category, id_company);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
