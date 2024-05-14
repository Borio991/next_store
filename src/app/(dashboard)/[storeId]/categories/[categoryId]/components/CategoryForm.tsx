'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Billboard, Category } from '@prisma/client';
import { Trash } from 'lucide-react';
import * as z from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AlertModal from '@/components/modals/alert-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  initialData: Category | null;
  billboards: Billboard[];
}

const categoryormSchema = z.object({
  name: z.string().min(2).max(100),
  billboardId: z.string(),
});

type CategoryormValues = z.infer<typeof categoryormSchema>;

function CategoryForm({ initialData, billboards }: Props) {
  const { storeId, categoryId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData ? 'Edit a Category' : 'Create a new Category';
  const toastMessage = initialData ? 'Category Updated.' : 'Category Created.';
  const action = initialData ? 'Edit Category' : 'Create Category';

  const form = useForm<CategoryormValues>({
    defaultValues: initialData || { name: '', billboardId: '' },
    resolver: zodResolver(categoryormSchema),
  });

  async function onSubmit(data: CategoryormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/categories/${categoryId}`, data);
      } else {
        await axios.post(`/api/${storeId}/categories`, data);
      }
      router.push(`/${storeId}/categories`);
      router.refresh();

      toast(toastMessage);
    } catch (error) {
      setLoading(false);
      toast('Error Updating Category');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/categories/${categoryId}`);
      router.push(`/${storeId}/categories`);
      router.refresh();
      toast(`"${initialData?.name}" Category Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting Category : Make sure you deleted all Porducts using this Category first');
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billboardId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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

export default CategoryForm;
