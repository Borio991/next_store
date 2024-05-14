'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

export const StoreFormSchema = z.object({
  name: z.string().min(2).max(100),
});

function StoreModal() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof StoreFormSchema>) {
    console.log(values);
    try {
      setLoading(true);
      const store = await axios.post('/api/stores', values);
      window.location.assign(`/${store.data.id}`);
      toast('a new Store has been created.', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    } catch (error) {
      toast('error occured.', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
      setLoading(false);
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }
  const { isOpen, onClose } = useStoreModal();
  return (
    <Modal
      title="Create store"
      description="Add new store to manage products and categorgies"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>store name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="E-commerce store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-2 flex items-center justify-end">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}

export default StoreModal;
