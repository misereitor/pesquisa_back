import { Response, Request, Router } from 'express';
import {
  getAllDataFromDashboard,
  getAllDataReportGeral,
  getAllDataReportCategory,
  getAllDataReportCity,
  getAllDataReportPercentagem,
  downloadReportGeral,
  downloadReportCategory,
  downloadReportCity,
  downloadReportPercentage
} from '../services/reports-service';

const reportsRouter = Router();

const { X_API_KEY } = process.env;

reportsRouter.get('/reports/dashboard', async (req: Request, res: Response) => {
  try {
    const data = await getAllDataFromDashboard();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

reportsRouter.get(
  '/reports/get-all-data-report-geral',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllDataReportGeral();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/get-all-data-report-category',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllDataReportCategory();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/get-all-data-report-city',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllDataReportCity();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/get-all-data-report-percentagem',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllDataReportPercentagem();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/download/geral',
  async (req: Request, res: Response) => {
    try {
      const { apikey } = req.query;
      if (!apikey) {
        throw new Error('API key is missing');
      }
      if (apikey !== X_API_KEY) {
        throw new Error('Invalid API key');
      }
      const data = await downloadReportGeral();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio-geral.csv'
      );
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/download/category',
  async (req: Request, res: Response) => {
    try {
      const { apikey } = req.query;
      if (!apikey) {
        throw new Error('API key is missing');
      }
      if (apikey !== X_API_KEY) {
        throw new Error('Invalid API key');
      }
      const data = await downloadReportCategory();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio-categoria.csv'
      );
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/download/city',
  async (req: Request, res: Response) => {
    try {
      const { apikey } = req.query;
      if (!apikey) {
        throw new Error('API key is missing');
      }
      if (apikey !== X_API_KEY) {
        throw new Error('Invalid API key');
      }
      const data = await downloadReportCity();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio-cidades.csv'
      );
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

reportsRouter.get(
  '/reports/download/percentage',
  async (req: Request, res: Response) => {
    try {
      const { apikey } = req.query;
      if (!apikey) {
        throw new Error('API key is missing');
      }
      if (apikey !== X_API_KEY) {
        throw new Error('Invalid API key');
      }
      const data = await downloadReportPercentage();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio-porcetagem.csv'
      );
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export { reportsRouter };