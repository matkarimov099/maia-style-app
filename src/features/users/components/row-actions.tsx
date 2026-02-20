import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { User } from '@/features/users/types';
import { useDisclosure } from '@/hooks/use-disclosure';
import { DeleteUserDialog } from './delete-user-dialog';
import { EditUserDialog } from './edit-user-dialog';

interface RowActionsProps {
  user: User;
}

export function RowActions({ user }: RowActionsProps) {
  const { t } = useTranslation();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={editDialog.open}
          aria-label={t('common.actions.edit')}
        >
          <IconEdit className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={deleteDialog.open}
          aria-label={t('common.actions.delete')}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="size-4" />
        </Button>
      </div>

      {editDialog.isOpen && (
        <EditUserDialog user={user} open={editDialog.isOpen} onOpenChange={editDialog.setIsOpen} />
      )}

      {deleteDialog.isOpen && (
        <DeleteUserDialog
          userId={user.id}
          fullName={`${user.firstname} ${user.lastname}`}
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
        />
      )}
    </>
  );
}
