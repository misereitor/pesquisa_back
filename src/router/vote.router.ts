import { Response, Request, Router } from 'express';
import { UserVote } from '../model/user-vote';
import {
  confirmVoteService,
  createVoteInCacheService,
  getAllDataForVoteService,
  getAllVotesService
} from '../services/votes.services';
import { Vote } from '../model/votes';

const voteRouter = Router();

voteRouter.get(
  '/voting/:id/get-all-data',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await getAllDataForVoteService(Number(id));
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.statusCode) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
);

voteRouter.get('/voting/:id/get-all', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const votes = await getAllVotesService(Number(id));
    res.status(200).json({ success: true, data: votes });
  } catch (error: any) {
    if (error.statusCode) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

voteRouter.post('/voting/create-vote', async (req: Request, res: Response) => {
  try {
    const vote: Vote = req.body;
    await createVoteInCacheService(vote);
    res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.statusCode) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

voteRouter.post('/voting/confirm-vote', async (req: Request, res: Response) => {
  try {
    const user: UserVote = req.body;
    await confirmVoteService(user);
    res.status(200).json({ success: true });
  } catch (error: any) {
    if (error.statusCode) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

export { voteRouter };
