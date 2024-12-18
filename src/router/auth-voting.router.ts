import { Response, Request, Router } from 'express';
import {
  checkUserRegistred,
  confirmCode,
  createUserAndSendMessage
} from '../services/auth-voting.service';
import { UserVote } from '../model/user-vote';

const authVotingRouter = Router();

authVotingRouter.get(
  '/voting/auth/:cpf',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cpf } = req.params;
      const userExist = await checkUserRegistred(cpf);
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

authVotingRouter.post('/voting/auth', async (req: Request, res: Response) => {
  try {
    const userVote: UserVote = req.body;
    const createUser = await createUserAndSendMessage(userVote);
    res.status(200).json({ success: true, data: createUser });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(200).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

authVotingRouter.post(
  '/voting/auth/confirm',
  async (req: Request, res: Response) => {
    try {
      const { code, phone } = req.body;

      const login = await confirmCode(code, phone);
      res.status(200).json({ success: true, data: login });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(200).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

export { authVotingRouter };
