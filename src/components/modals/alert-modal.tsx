'use client';

import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function AlertModal({ isOpen, loading, onClose, onConfirm }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Modal title="Are you Sure" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={'outline'} onClick={onClose}>
          Cancle
        </Button>
        <Button disabled={loading} variant={'destructive'} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default AlertModal;
