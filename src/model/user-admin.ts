export interface UserAdmin {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'superadmin';
  active: boolean;
  last_ip: string;
  date_create: Date;
}

export interface Login {
  username: string;
  password: string;
}
