import { Response, Request, Router } from 'express';
import {
  createAssociationByCategoryArrayService,
  createAssociationByCategoryService,
  deleteAssociationService,
  getAllAssociationService,
  getAssociationByCategoryIdService
} from '../services/association-category-company.service';
import { AssociationCategoryAndCompany } from '../model/association-company-category';

const associateCategoryCompanyRouter = Router();

associateCategoryCompanyRouter.get(
  '/association/get-all',
  async (req: Request, res: Response) => {
    try {
      const response = await getAllAssociationService();
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

associateCategoryCompanyRouter.post(
  '/association/create-many',
  async (req: Request, res: Response) => {
    try {
      const association: AssociationCategoryAndCompany[] = req.body;
      await createAssociationByCategoryArrayService(association);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default associateCategoryCompanyRouter;
