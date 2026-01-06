import { VotesConfirmed } from './votes';

export interface UserVote {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  country: string;
  state: string;
  city: string;
  confirmed_vote: boolean;
  try_code_send: number;
  confirmed_phone: boolean;
  date_create: Date;
  date_vote: Date;
  percentage_vote?: number;
  last_ip: string;
  votes: VotesConfirmed[];
}
