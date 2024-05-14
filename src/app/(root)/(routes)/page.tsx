'use client';

import { useStoreModal } from '@/hooks/use-store-modal';
import { UserButton } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Home() {
  const open = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(() => {
    if (!open) {
      onOpen();
    }
  }, [open, onOpen]);
  return null;
}
