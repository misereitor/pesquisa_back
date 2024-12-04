import { Response, Request, Router } from 'express';
import { UserVote } from '../model/user-vote';
import {
  confirmVoteService,
  createVoteInCacheService,
  getAllVotesService
} from '../services/votes.services';
import { Vote } from '../model/votes';

const voteRouter = Router();

voteRouter.get('/voting/:id/get-all', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const votes = getAllVotesService(Number(id));
    res.status(200).json({ success: true, data: votes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

voteRouter.post('/voting/create-vote', async (req: Request, res: Response) => {
  try {
    const vote: Vote = req.body;
    await createVoteInCacheService(vote);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

voteRouter.post('/voting/confirm-vote', async (req: Request, res: Response) => {
  try {
    const user: UserVote = req.body;
    await confirmVoteService(user);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { voteRouter };
