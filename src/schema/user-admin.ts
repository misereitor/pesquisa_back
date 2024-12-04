import { z } from 'zod';
import { validateName, validateNameIsNumber } from '../util/validate-user-vote';

export const schemaAddUserAdmin = z.object({
  username: z
    .string()
    .refine(
      (val) => !/[^.-\w]/g.test(val),
      'Nome de login não pode ter caracteres especiais'
    ),
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
  email: z.string().email('Insira um e-mail válido'),
  role: z.string().optional(),
  password: z
    .string()
    .min(8, 'A senha tem que ter ao menos 8 caracteres')
    .superRefine((val, ctx) => {
      const regexNumber = !/\d/.test(val);
      const regexLetter = !/\D/.test(val);
      const regexCaracter = !/\W/.test(val);
      const regexUpperCase = !/[A-Z]/g.test(val);
      const regexLowerCase = !/[a-z]/g.test(val);
      if (regexNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um número ' + val,
          fatal: true
        });
      }
      if (regexLetter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra',
          fatal: true
        });
      }
      if (regexCaracter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um caracter como @ !',
          fatal: true
        });
      }
      if (regexLowerCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
          fatal: true
        });
      }
    })
});

export const schemaAlterPassword = z.object({
  password: z
    .string()
    .min(8, 'A senha tem que ter ao menos 8 caracteres')
    .superRefine((val, ctx) => {
      const regexNumber = !/\d/.test(val);
      const regexLetter = !/\D/.test(val);
      const regexCaracter = !/\W/.test(val);
      const regexUpperCase = !/[A-Z]/g.test(val);
      const regexLowerCase = !/[a-z]/g.test(val);
      if (regexNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um número',
          fatal: true
        });
      }
      if (regexLetter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra',
          fatal: true
        });
      }
      if (regexCaracter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um caracter como @ !',
          fatal: true
        });
      }
      if (regexLowerCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
          fatal: true
        });
      }
    })
});

export const schemaUpdateUserAdmin = z.object({
  username: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || !/[^.-\w]/g.test(val),
      'Nome de login não pode ter caracteres especiais'
    ),
  name: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      if (val !== undefined) {
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
      }
    }),
  email: z.string().email('Insira um e-mail válido').optional(),
  role: z.string().optional()
});

export const schemaUserAdminRole = z.object({
  role: z.string()
});

export type FormAddUserAdmin = z.infer<typeof schemaAddUserAdmin>;
export type FormAlterPassword = z.infer<typeof schemaAlterPassword>;
export type FormUserAdminRole = z.infer<typeof schemaUserAdminRole>;
export type FormUpdateUserAdmin = z.infer<typeof schemaUpdateUserAdmin>;
