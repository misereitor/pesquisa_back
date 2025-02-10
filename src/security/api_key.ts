import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';

config();
const { X_API_KEY } = process.env;

export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.path);
    if (
      req.path.split('/')[4] === 'reports' &&
      req.path.split('/')[5] === 'download'
    ) {
      next();
      return;
    }
    const apiKey = req.header('X-API-KEY');
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    if (apiKey !== X_API_KEY) {
      throw new Error('Invalid API key');
    }
    next();
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};
