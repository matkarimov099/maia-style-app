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
import { useCreateUser } from '@/features/users/hooks/use-users';
import { createUserSchema } from '@/features/users/schema/users.schema';
import { RoleValues } from '@/types/enums';

export function CreateUserDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();

  const schema = createUserSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createUser.mutateAsync(values);
      toast.success(t('users.success.created'));
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
          {t('users.actions.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('users.create.title')}</DialogTitle>
          <DialogDescription>{t('users.create.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.firstname}>
              <FieldLabel>{t('users.fields.firstname.label')}</FieldLabel>
              <Input
                placeholder={t('users.fields.firstname.placeholder')}
                {...form.register('firstname')}
              />
              <FieldError>{form.formState.errors.firstname?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.lastname}>
              <FieldLabel>{t('users.fields.lastname.label')}</FieldLabel>
              <Input
                placeholder={t('users.fields.lastname.placeholder')}
                {...form.register('lastname')}
              />
              <FieldError>{form.formState.errors.lastname?.message}</FieldError>
            </Field>
          </div>

          <Field data-invalid={!!form.formState.errors.username}>
            <FieldLabel>{t('users.fields.username.label')}</FieldLabel>
            <Input
              placeholder={t('users.fields.username.placeholder')}
              {...form.register('username')}
            />
            <FieldError>{form.formState.errors.username?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel>{t('users.fields.email.label')}</FieldLabel>
            <Input
              type="email"
              placeholder={t('users.fields.email.placeholder')}
              {...form.register('email')}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel>{t('users.fields.password.label')}</FieldLabel>
            <Input
              type="password"
              placeholder={t('users.fields.password.placeholder')}
              {...form.register('password')}
            />
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.role}>
            <FieldLabel>{t('users.fields.role.label')}</FieldLabel>
            <Select
              value={form.watch('role')}
              onValueChange={value => form.setValue('role', value, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('users.fields.role.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {RoleValues.map(role => (
                  <SelectItem key={role} value={role}>
                    {t(`enums.role.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.role?.message}</FieldError>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? t('common.actions.creating') : t('common.actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
