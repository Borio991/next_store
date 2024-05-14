'use client';
import { ProductColumn } from './columns';
import AlertModal from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  data: ProductColumn;
}

function CellActions({ data }: Props) {
  const { storeId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function onCopy(copy: string) {
    navigator.clipboard.writeText(copy);
    toast('Prodct id Copied.');
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/products/${data.id}`);
      router.refresh();
      toast(`"${data.name}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting Product.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div>
      <AlertModal isOpen={open} loading={loading} onConfirm={onDelete} onClose={() => setOpen(false)} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 w-4 h-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${storeId}/products/${data.id}`)}>
            <Edit className="mr-2 w-4 h-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default CellActions;
