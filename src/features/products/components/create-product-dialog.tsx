import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
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
  DialogTrigger,
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
import { useCreateProduct } from '@/features/products/hooks/use-products';
import { createProductSchema } from '@/features/products/schema/products.schema';
import { ProductCategoryValues } from '@/types/enums';

export function CreateProductDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const createProduct = useCreateProduct();

  const schema = createProductSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: 0,
      category: undefined,
      status: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createProduct.mutateAsync(values);
      toast.success(t('products.success.created'));
      form.reset();
      setOpen(false);
    } catch {
      toast.error(t('common.states.error'));
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="size-4" data-icon="inline-start" />
          {t('products.actions.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('products.create.title')}</DialogTitle>
          <DialogDescription>{t('products.create.description')}</DialogDescription>
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

          <Field data-invalid={!!form.formState.errors.category}>
            <FieldLabel>{t('products.fields.category.label')}</FieldLabel>
            <Select
              value={form.watch('category')}
              onValueChange={value => form.setValue('category', value, { shouldValidate: true })}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? t('common.actions.creating') : t('common.actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
