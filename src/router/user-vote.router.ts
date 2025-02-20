import { Request, Response, Router } from 'express';
import {
  alterPhoneByUserId,
  getUserVoteByCPF
} from '../services/user-vote.service';

const userVoteRouter = Router();

userVoteRouter.get(
  '/admin/user-vote/:cpf',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpf } = req.params;
      const userExist = await getUserVoteByCPF(cpf);
      res.status(200).json({ success: true, data: userExist });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

userVoteRouter.post(
  '/admin/alter-phone',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, id } = req.body;
      await alterPhoneByUserId(phone, id);
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

export { userVoteRouter };
