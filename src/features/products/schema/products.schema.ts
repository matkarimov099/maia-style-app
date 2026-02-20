import type { TFunction } from 'i18next';
import { z } from 'zod';
import { ProductCategoryValues } from '@/types/enums';

export const createProductSchema = (t: TFunction) => {
  return z.object({
    name: z
      .string({ message: t('products.fields.name.validation.required') })
      .min(2, t('products.fields.name.validation.minLength', { min: 2 })),
    price: z
      .number({ message: t('products.fields.price.validation.required') })
      .min(0, t('products.fields.price.validation.min', { min: 0 })),
    category: z.enum(ProductCategoryValues as [string, ...string[]], {
      message: t('products.fields.category.validation.required'),
    }),
    status: z.string().optional(),
    image: z.string().optional(),
  });
};
