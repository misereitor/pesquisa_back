import { z } from 'zod';
import {
  validateName,
  validateNameIsNumber,
  validateCPF
} from '../util/validate-user-vote';

export const schemaUserVote = z.object({
  name: z.string().superRefine((val, ctx) => {
    if (validateName(val.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Coloque o seu nome completo!',
        fatal: true
      });
    }
    if (validateNameIsNumber(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome não pode ter símbolos ou números',
        fatal: true
      });
    }
  }),
  phone: z.string(),
  cpf: z.string().refine((val) => !validateCPF(val), 'CPF inválido!'),
  state: z.string(),
  country: z.string(),
  city: z.string()
});

export type SchemaUserVote = z.infer<typeof schemaUserVote>;
