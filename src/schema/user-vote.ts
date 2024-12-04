import { z } from 'zod';
import {
  validateName,
  validateNameIsNumber,
  validatePhone,
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
  phone: z.string().refine((val) => !validatePhone(val), 'Telefone Inválido!'),
  cpf: z.string().refine((val) => !validateCPF(val), 'CPF inválido!'),
  uf: z.string().length(2),
  city: z.string()
});

export type SchemaUserVote = z.infer<typeof schemaUserVote>;
