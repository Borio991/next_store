'use client';
import { Button } from '@/components/ui/button';
import { ImagePlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface Props {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

function ImageUpload({ disabled, onChange, onRemove, value }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url, i) => (
          <div className="relative rounded-md overflow-hidden" key={i}>
            <Image width={180} height={180} alt="product image" className="object-cover w-64 h-64" src={url} />
            <div className="absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant={'destructive'} size={'icon'}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={(results: any) => onUpload(results)} uploadPreset="qqsjv6rv">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button disabled={disabled} type="button" variant={'secondary'} onClick={onClick}>
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
