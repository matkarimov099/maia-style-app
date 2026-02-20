import type { TFunction } from 'i18next';
import { z } from 'zod';
import { RoleValues } from '@/types/enums';

export const createUserSchema = (t: TFunction) => {
  return z.object({
    username: z
      .string({ message: t('users.fields.username.validation.required') })
      .min(3, t('users.fields.username.validation.minLength', { min: 3 })),
    firstname: z.string({ message: t('users.fields.firstname.validation.required') }).min(1),
    lastname: z.string({ message: t('users.fields.lastname.validation.required') }).min(1),
    email: z
      .string({ message: t('users.fields.email.validation.required') })
      .email(t('users.fields.email.validation.invalid')),
    password: z.string().min(6),
    role: z.enum(RoleValues as [string, ...string[]], {
      message: t('users.fields.role.validation.required'),
    }),
  });
};
