import { Response, Request, Router } from 'express';
import {
  createAssociationByCategoryArrayService,
  createAssociationByCategoryService,
  createManyAssociationByCategoryService,
  deleteAssociationService,
  getAllAssociationService,
  getAssociationByCategoryIdService
} from '../services/association-category-company.service';
import {
  AssociationCategoryAndCompany,
  ImportCSV
} from '../model/association-company-category';

const associateCategoryCompanyRouter = Router();

associateCategoryCompanyRouter.get(
  '/association/get-all',
  async (req: Request, res: Response) => {
    try {
      const response = await getAllAssociationService();
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

associateCategoryCompanyRouter.get(
  '/association/get/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await getAssociationByCategoryIdService(Number(id));
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

associateCategoryCompanyRouter.post(
  '/association/create',
  async (req: Request, res: Response) => {
    try {
      const { id_category, id_company } = req.body;
      await createAssociationByCategoryService(id_category, id_company);
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

associateCategoryCompanyRouter.post(
  '/association/create-many',
  async (req: Request, res: Response) => {
    try {
      const associate: AssociationCategoryAndCompany[] = req.body;
      await createManyAssociationByCategoryService(associate);
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

associateCategoryCompanyRouter.post(
  '/import/create-many',
  async (req: Request, res: Response) => {
    try {
      const association: ImportCSV[] = req.body;
      await createAssociationByCategoryArrayService(association);
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

associateCategoryCompanyRouter.delete(
  '/association/delete',
  async (req: Request, res: Response) => {
    try {
      const { id_category, id_company } = req.body;
      await deleteAssociationService(id_category, id_company);
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

export default associateCategoryCompanyRouter;
