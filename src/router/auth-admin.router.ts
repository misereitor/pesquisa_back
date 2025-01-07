import { Response, Request, Router } from 'express';
import {
  checkMasterPassword,
  loginUserAdminService,
  registerUserService
} from '../services/auth-admin.service';
import { Login, UserAdmin } from '../model/user-admin';

const loginAdminRouter = Router();

loginAdminRouter.post(
  '/admin/auth/login',
  async (req: Request, res: Response) => {
    try {
      const logn: Login = req.body;
      const response = await loginUserAdminService(logn);
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

loginAdminRouter.post(
  '/admin/auth/registre',
  async (req: Request, res: Response) => {
    try {
      const user: UserAdmin = req.body;
      const response = await registerUserService(user);
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

loginAdminRouter.post(
  '/admin/auth/master-password',
  async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const response = await checkMasterPassword(password);
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

export default loginAdminRouter;
