'use client';
import { Button } from '@/components/ui/button';
import { ImagePlusIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import React, { useState } from 'react';

function Page() {
  const [content, setContent] = useState<string[]>([]);
  return (
    <div className="flex items-center justify-center h-96 ">
      {content.map((url) => (
        <Image src={url} alt="" width={300} height={400} />
      ))}
      <CldUploadWidget
        onSuccess={(results: any) => {
          console.log(results.info.secure_url);
          setContent((prev) => [...prev, results.info.secure_url]);
          //   setContent([...content, results.info.secure_url]);
        }}
        uploadPreset="qqsjv6rv"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button type="button" variant={'secondary'} onClick={onClick}>
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default Page;
