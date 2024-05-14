import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Server, Terminal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

function ApiAlert({ title, description, variant = 'public' }: ApiAlertProps) {
  const textMap: Record<ApiAlertProps['variant'], string> = {
    public: 'Public',
    admin: 'Admin',
  };

  const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive',
  };

  function onCopy() {
    navigator.clipboard.writeText(description);
    toast('API ROUTE Copied.');
  }

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-4">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant={'outline'} size={'icon'} onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default ApiAlert;
