import { Response, Request, Router } from 'express';
import {
  createCategoriesService,
  createCategoryService,
  disableCategoryService,
  getAllCategoryService,
  getCategoryByIdService,
  updateCategoryService
} from '../services/category.service';
import { Category } from '../model/category';
import { AssociationCompanyAndCategory } from '../model/association-company-category';

const categoryRouter = Router();

categoryRouter.get('/category/get-all', async (req: Request, res: Response) => {
  try {
    const response = await getAllCategoryService();
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

categoryRouter.get('/category/get/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getCategoryByIdService(Number(id));
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

categoryRouter.post('/category/create', async (req: Request, res: Response) => {
  try {
    const category: Category = req.body;
    const response = await createCategoryService(category);
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

categoryRouter.post(
  '/category/create-many',
  async (req: Request, res: Response) => {
    try {
      const categories: AssociationCompanyAndCategory[] = req.body;
      const response = await createCategoriesService(categories);
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

categoryRouter.put('/category/update', async (req: Request, res: Response) => {
  try {
    const category: Category = req.body;
    const response = await updateCategoryService(category);
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

categoryRouter.put(
  '/category/disable/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await disableCategoryService(Number(id));
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default categoryRouter;
