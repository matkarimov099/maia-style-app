import type { TFunction } from 'i18next';
import { z } from 'zod';
import type { UpdateProfileDto } from '@/features/profile/types';

export const createProfileSchema = (t: TFunction) => {
  return z.object({
    firstname: z.string({ message: t('profile.fields.firstname.label') }).min(1),
    lastname: z.string({ message: t('profile.fields.lastname.label') }).min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }) satisfies z.ZodType<UpdateProfileDto>;
};
