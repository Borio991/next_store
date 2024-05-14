'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Billboard, Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import * as z from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AlertModal from '@/components/modals/alert-modal';

interface Props {
  initialData: Size | null;
}

const sizeFormSchema = z.object({
  name: z.string().min(2).max(100),
  value: z.string(),
});

type SizeFormValues = z.infer<typeof sizeFormSchema>;

function SizeForm({ initialData }: Props) {
  const { storeId, sizeId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Size' : 'Create Size';
  const description = initialData ? 'Edit a Size' : 'Create a new Size';
  const toastMessage = initialData ? 'Size Updated.' : 'Size Created.';
  const action = initialData ? 'Edit Size' : 'Create Size';

  const form = useForm<SizeFormValues>({
    defaultValues: initialData || { name: '', value: '' },
    resolver: zodResolver(sizeFormSchema),
  });

  async function onSubmit(data: SizeFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data);
      } else {
        await axios.post(`/api/${storeId}/sizes`, data);
      }
      router.push(`/${storeId}/sizes`);
      router.refresh();

      toast(toastMessage);
    } catch (error) {
      setLoading(false);
      toast('Error Updating size');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
      router.refresh();
      router.push(`/${storeId}/sizes`);
      toast(`"${initialData?.name}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting Size : Make sure you deleted all products using this size first');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onConfirm={onDelete} onClose={() => setOpen(false)} loading={loading} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button disabled={loading} variant={'destructive'} size={'icon'} onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Form {...form}>
        <Separator />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full my-4">
          <div className="grid grid-cols-4 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default SizeForm;
