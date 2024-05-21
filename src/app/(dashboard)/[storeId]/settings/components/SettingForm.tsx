'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Store } from '@prisma/client';
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
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/useOrigin';

interface Props {
  initialData: Store;
}

const storeFormSchema = z.object({
  name: z.string().min(2).max(100),
});

type SettingsFormValues = z.infer<typeof storeFormSchema>;

function SettingForm({ initialData }: Props) {
  const origin = useOrigin();

  const { storeId } = useParams();
  const rouer = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    defaultValues: initialData,
    resolver: zodResolver(storeFormSchema),
  });

  async function onSubmit(data: SettingsFormValues) {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${storeId}`, data);
      rouer.refresh();
      toast('Store Updated.');
    } catch (error) {
      setLoading(false);
      toast('Error Updating Store');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}`);
      rouer.refresh();
      rouer.push('/');
      toast(`"${initialData.name}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Make sure you deleted all products and categories first');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onConfirm={onDelete} onClose={() => setOpen(false)} loading={loading} />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button disabled={loading} variant={'destructive'} size={'icon'} onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-col-3 gap-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${storeId}`} variant="public" />
    </>
  );
}

export default SettingForm;
