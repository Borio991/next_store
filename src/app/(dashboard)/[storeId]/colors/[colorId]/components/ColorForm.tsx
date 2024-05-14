'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Color } from '@prisma/client';
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
  initialData: Color | null;
}

const colorFormSchema = z.object({
  name: z.string().min(2).max(100),
  value: z.string().min(4).regex(/^#/, {
    message: 'Color must be a valid hex code.',
  }),
});

type ColorFormValues = z.infer<typeof colorFormSchema>;

function SizeForm({ initialData }: Props) {
  const { storeId, colorId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Color' : 'Create Color';
  const description = initialData ? 'Edit a Color' : 'Create a new Color';
  const toastMessage = initialData ? 'Color Updated.' : 'Color Created.';
  const action = initialData ? 'Edit Color' : 'Create Color';

  const form = useForm<ColorFormValues>({
    defaultValues: initialData || { name: '', value: '' },
    resolver: zodResolver(colorFormSchema),
  });

  async function onSubmit(data: ColorFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
      } else {
        await axios.post(`/api/${storeId}/colors`, data);
      }
      router.push(`/${storeId}/colors`);
      router.refresh();

      toast(toastMessage);
    } catch (error) {
      setLoading(false);
      toast('Error Updating Color');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.refresh();
      router.push(`/${storeId}/colors`);
      toast(`"${initialData?.name}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting Color : Make sure you deleted all products using this Color first');
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
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color name" {...field} />
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
                  <FormLabel>Pick A Color</FormLabel>
                  <FormControl className="w-72 h-36 hover:cursor-pointer">
                    <Input disabled={loading} {...field} type="color" />
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
