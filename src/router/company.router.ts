import { Response, Request, Router } from 'express';
import {
  associateCompanyService,
  createCompaniesService,
  createCompanyService,
  disableCompanyService,
  getAllCompanyService,
  getCompanyByIdService,
  updateCompanyService
} from '../services/company.service';
import { Company } from '../model/company';

const companyRouter = Router();

companyRouter.get('/company/get-all', async (req: Request, res: Response) => {
  try {
    const response = await getAllCompanyService();
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

companyRouter.get('/company/get/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getCompanyByIdService(Number(id));
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

companyRouter.post('/company/create', async (req: Request, res: Response) => {
  try {
    const company: Company = req.body;
    const response = await createCompanyService(company);
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

companyRouter.post(
  '/company/create-many',
  async (req: Request, res: Response) => {
    try {
      const companis: Company[] = req.body;
      const response = await createCompaniesService(companis);
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

companyRouter.put('/company/update', async (req: Request, res: Response) => {
  try {
    const company: Company = req.body;
    const response = await updateCompanyService(company);
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

companyRouter.put(
  '/company/association',
  async (req: Request, res: Response) => {
    try {
      const { id, associate }: { id: number; associate: boolean } = req.body;
      await associateCompanyService(id, associate);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

companyRouter.put(
  '/company/disable/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await disableCompanyService(Number(id));
      res.status(200).json({ success: true, data: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default companyRouter;
