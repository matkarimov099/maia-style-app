import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateProduct } from '@/features/products/hooks/use-products';
import { updateProductSchema } from '@/features/products/schema/products.schema';
import type { Product } from '@/features/products/types';
import type { ProductCategory, ProductStatus } from '@/types/enums';
import { ProductCategoryValues, ProductStatusValues } from '@/types/enums';

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const { t } = useTranslation();
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const schema = updateProductSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      price: product.price,
      category: product.category,
      status: product.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        price: product.price,
        category: product.category,
        status: product.status,
      });
    }
  }, [open, product, form]);

  const onSubmit = (values: FormValues) => {
    updateProduct(
      { id: product.id, ...values },
      {
        onSuccess: () => {
          toast.success(t('products.success.updated'));
          onOpenChange(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || t('common.states.error'));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('products.edit.title')}</DialogTitle>
          <DialogDescription>{t('products.edit.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel>{t('products.fields.name.label')}</FieldLabel>
            <Input placeholder={t('products.fields.name.placeholder')} {...form.register('name')} />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel>{t('products.fields.price.label')}</FieldLabel>
            <Input
              type="number"
              placeholder={t('products.fields.price.placeholder')}
              {...form.register('price', { valueAsNumber: true })}
            />
            <FieldError>{form.formState.errors.price?.message}</FieldError>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.category}>
              <FieldLabel>{t('products.fields.category.label')}</FieldLabel>
              <Select
                value={form.watch('category')}
                onValueChange={value =>
                  form.setValue('category', value as ProductCategory, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('products.fields.category.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {ProductCategoryValues.map(category => (
                    <SelectItem key={category} value={category}>
                      {t(`enums.productCategory.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.formState.errors.category?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.status}>
              <FieldLabel>{t('products.fields.status.label')}</FieldLabel>
              <Select
                value={form.watch('status')}
                onValueChange={value =>
                  form.setValue('status', value as ProductStatus, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('products.fields.status.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {ProductStatusValues.map(status => (
                    <SelectItem key={status} value={status}>
                      {t(`enums.productStatus.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.formState.errors.status?.message}</FieldError>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('common.actions.saving') : t('common.actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
