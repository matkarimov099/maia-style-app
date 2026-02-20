import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Product } from '@/features/products/types';
import { useDisclosure } from '@/hooks/use-disclosure';
import { DeleteProductDialog } from './DeleteProductDialog';
import { EditProductDialog } from './EditProductDialog';

interface RowActionsProps {
  product: Product;
}

export function RowActions({ product }: RowActionsProps) {
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
        <EditProductDialog
          product={product}
          open={editDialog.isOpen}
          onOpenChange={editDialog.setIsOpen}
        />
      )}

      {deleteDialog.isOpen && (
        <DeleteProductDialog
          productId={product.id}
          productName={product.name}
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
        />
      )}
    </>
  );
}
