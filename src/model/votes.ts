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
  trade_name: string;
  category_name: string;
}

export interface CategoryVotes {
  category_name: string;
  total: number;
  companies: CategoryVotesCompany[];
}

export interface CategoryVotesCompany {
  name: string;
  value: number;
}

export interface TotalCountForUser {
  total_items: number;
  total_confirmed_true: number;
  total_confirmed_false: number;
  total_percentage_above_70: number;
  total_percentage_below_70: number;
}

export interface TotalCountForCity {
  city: string;
  total: number;
}

export interface GraphReport {
  category_name: string;
  companies: {
    name: string;
    value: number;
  }[];
}
