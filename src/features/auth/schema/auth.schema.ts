import type { TFunction } from 'i18next';
import { z } from 'zod';
import type { LoginCredentials } from '@/features/auth/types';

export const createLoginSchema = (t: TFunction) => {
  return z.object({
    username: z
      .string({ message: t('auth.fields.username.validation.required') })
      .min(3, t('auth.fields.username.validation.minLength', { min: 3 })),
    password: z
      .string({ message: t('auth.fields.password.validation.required') })
      .min(4, t('auth.fields.password.validation.minLength', { min: 4 })),
  }) satisfies z.ZodType<LoginCredentials>;
};
