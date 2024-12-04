import { Company } from './company';

export interface AssociationCompanyAndCategory {
  id: number;
  name: string;
  active: boolean;
  date_create: Date;
  company: Company[];
}

export interface AssociationCategoryAndCompany {
  id_category: number;
  id_company: number;
}
