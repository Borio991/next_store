'use client';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product, Image, Color, Category, Size } from '@prisma/client';
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
import ImageUpload from '@/components/ui/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FORMATTEDPRODUCTTYPE } from '@/app/(dashboard)/[storeId]/products/[productId]/page';

interface Props {
  initialData: FORMATTEDPRODUCTTYPE | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const productFormSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.coerce.number(),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  categoryId: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

function ProductForm({ initialData, categories, sizes, colors }: Props) {
  console.log('initialData : ', initialData);
  const { storeId, productId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Product' : 'Create Product';
  const description = initialData ? 'Edit a Product' : 'Create a new Product';
  const toastMessage = initialData ? 'Product Updated.' : 'Product Created.';
  const action = initialData ? 'Edit Product' : 'Create Product';

  const form = useForm<ProductFormValues>({
    defaultValues: initialData
      ? initialData
      : {
          name: '',
          images: [],
          price: 0,
          isArchived: false,
          isFeatured: false,
          categoryId: '',
          colorId: '',
          sizeId: '',
        },
    resolver: zodResolver(productFormSchema),
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/products/${productId}`, data);
      } else {
        await axios.post(`/api/${storeId}/products`, data);
      }
      router.push(`/${storeId}/products`);
      router.refresh();

      toast(toastMessage);
    } catch (error) {
      setLoading(false);
      toast('Error Updating Product');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/products/${productId}`);
      router.refresh();
      router.push(`/${storeId}/products`);
      toast(`"${initialData?.name}" Deleted`);
    } catch (error) {
      setLoading(false);
      toast('Error Deleting Product');
    } finally {
      setLoading(false);
    }
  }

  console.log('form values :', form.getValues());

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
          <div>
            <FormField
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div>
                      <ImageUpload
                        value={field.value.map((image) => image.url)}
                        disabled={loading}
                        onChange={(url) => field.onChange([...form.getValues('images'), { url }])}
                        onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-8">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="product price..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="sizeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="colorId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="isFeatured"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Feaured</FormLabel>
                      <FormDescription>This Product will apeear on the home page</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="isArchived"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>This Product will not appear anywhere in the store</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ProductForm;
