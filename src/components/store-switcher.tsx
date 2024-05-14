'use client';

import { useParams, useRouter } from 'next/navigation';
import { Store } from '@prisma/client';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);
  const storeModel = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({ label: item.name, value: item.id }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  function onStoreSelect(store: { label: string; value: string }) {
    setOpen(false);
    router.push(`/${store.value}`);
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role="combobox"
          size={'sm'}
          aria-expanded={open}
          aria-label="Select a Store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="opacity-50 w-4 h-4 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="search stores..." />
            <CommandEmpty>No Store Found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)}>
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn('ml-auto h-4 w-4', currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModel.onOpen();
                }}
              >
                <PlusCircle className="mr-2 w-5 h-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoreSwitcher;
