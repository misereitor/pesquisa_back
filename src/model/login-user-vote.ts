export interface ConfirmedPhone {
  id: number;
  phone: string;
  id_user_vote: number;
  expiration_date: Date;
  code: string;
}
