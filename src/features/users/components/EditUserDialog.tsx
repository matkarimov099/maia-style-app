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
import { useUpdateUser } from '@/features/users/hooks/use-users';
import { updateUserSchema } from '@/features/users/schema/users.schema';
import type { User } from '@/features/users/types';
import type { Role, UserStatus } from '@/types/enums';
import { RoleValues, UserStatusValues } from '@/types/enums';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { t } = useTranslation();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const schema = updateUserSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [open, user, form]);

  const onSubmit = (values: FormValues) => {
    updateUser(
      { id: user.id, ...values },
      {
        onSuccess: () => {
          toast.success(t('users.success.updated'));
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
          <DialogTitle>{t('users.edit.title')}</DialogTitle>
          <DialogDescription>{t('users.edit.description')}</DialogDescription>
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

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel>{t('users.fields.email.label')}</FieldLabel>
            <Input
              type="email"
              placeholder={t('users.fields.email.placeholder')}
              {...form.register('email')}
            />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.role}>
              <FieldLabel>{t('users.fields.role.label')}</FieldLabel>
              <Select
                value={form.watch('role')}
                onValueChange={value =>
                  form.setValue('role', value as Role, { shouldValidate: true })
                }
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

            <Field data-invalid={!!form.formState.errors.status}>
              <FieldLabel>{t('users.fields.status.label')}</FieldLabel>
              <Select
                value={form.watch('status')}
                onValueChange={value =>
                  form.setValue('status', value as UserStatus, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('users.fields.status.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {UserStatusValues.map(status => (
                    <SelectItem key={status} value={status}>
                      {t(`enums.userStatus.${status}`)}
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
