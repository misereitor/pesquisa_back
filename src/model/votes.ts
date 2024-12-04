import { Company } from './company';
import { UserVote } from './user-vote';

export interface Vote {
  id_user_vote: number;
  id_category: number;
  id_company: number;
}

interface CompanyVote {
  id: number;
  name: string;
  company: Company;
}

export interface Votes {
  user_vote: UserVote;
  votes: CompanyVote[];
}

export interface VotesConfirmed {
  id_category: number;
  id_company: number;
  company_name: string;
  category_name: string;
}
