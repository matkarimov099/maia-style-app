import type { TFunction } from 'i18next';
import { z } from 'zod';
import type { Role, UserStatus } from '@/types/enums';
import { RoleValues, UserStatusValues } from '@/types/enums';

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
    password: z
      .string({ message: t('users.fields.password.validation.required') })
      .min(6, t('users.fields.password.validation.minLength', { min: 6 })),
    role: z.enum(RoleValues as [Role, ...Role[]], {
      message: t('users.fields.role.validation.required'),
    }),
  });
};

export const updateUserSchema = (t: TFunction) => {
  return z.object({
    firstname: z.string({ message: t('users.fields.firstname.validation.required') }).min(1),
    lastname: z.string({ message: t('users.fields.lastname.validation.required') }).min(1),
    email: z
      .string({ message: t('users.fields.email.validation.required') })
      .email(t('users.fields.email.validation.invalid')),
    role: z.enum(RoleValues as [Role, ...Role[]], {
      message: t('users.fields.role.validation.required'),
    }),
    status: z.enum(UserStatusValues as [UserStatus, ...UserStatus[]]),
  });
};
