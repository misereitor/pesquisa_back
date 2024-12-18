import { Request, Response, Router } from 'express';
import { UserAdmin } from '../model/user-admin';
import {
  alterPasswordUserAdminService,
  alterProfileUserAdminService,
  alterRoleUserAdminService,
  deleteUserAdminService
} from '../services/user-admin.service';
import { getAllUserAdminService } from '../services/auth-admin.service';

const userAdminRouter = Router();

userAdminRouter.get(
  '/admin/user/get-all',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllUserAdminService();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

userAdminRouter.put(
  '/admin/user/update/:id/password',
  async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { id } = req.params;
      await alterPasswordUserAdminService(Number(id), password);
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

userAdminRouter.put(
  '/admin/user/update/:id/profile',
  async (req: Request, res: Response) => {
    try {
      const user: UserAdmin = req.body;
      const { id } = req.params;
      const data = await alterProfileUserAdminService(Number(id), user);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

userAdminRouter.put(
  '/admin/user/update/:id/role',
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      await alterRoleUserAdminService(Number(id), role);
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

userAdminRouter.put(
  '/admin/user/delete/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await deleteUserAdminService(Number(id));
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

export { userAdminRouter };
