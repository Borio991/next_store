'use client';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/useOrigin';
import { useParams } from 'next/navigation';
import React from 'react';

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

function ApiList({ entityIdName, entityName }: ApiListProps) {
  const origin = useOrigin();
  const params = useParams();
  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="DELETE" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    </>
  );
}

export default ApiList;
