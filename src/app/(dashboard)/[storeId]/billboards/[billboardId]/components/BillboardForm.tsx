'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Billboard } from '@prisma/client';
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
import ImageUpload from '@/components/ui/ImageUpload';

interface Props {
  initialData: Billboard | null;
}

const billboardFormSchema = z.object({
  label: z.string().min(2).max(100),
  imageUrl: z.string(),
});

type BillboardFormValues = z.infer<typeof billboardFormSchema>;

function BillBoardForm({ initialData }: Props) {
  const { storeId, billboardId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit a Billboard' : 'Create a new Billboard';
  const toastMessage = initialData ? 'Billboard Updated.' : 'Billboard Created.';
  const action = initialData ? 'Edit billboard' : 'Create billboard';

  const form = useForm<BillboardFormValues>({
    defaultValues: initialData || { label: '', imageUrl: '' },
    resolver: zodResolver(billboardFormSchema),
  });

  async function onSubmit(data: BillboardFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
      } else {
        await axios.post(`/api/${storeId}/billboards`, data);
      }
      router.push(`/${storeId}/billboards`);
      router.refresh();

      toast(toastMessage);
    } catch (error) {
      setLoading(false);
      toast('Error Updating billboard');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast(`"${initialData?.label}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting billboard : Make sure you deleted all categories using this billboard first');
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
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="label"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field} />
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

export default BillBoardForm;

// 8 ,256 ,4642
