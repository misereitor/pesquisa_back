import { Response, Request, Router } from 'express';
import {
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
      res.status(500).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default loginAdminRouter;
