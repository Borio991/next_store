import React from 'react';

interface Props {
  title: string;
  description?: string;
}

function Heading({ title, description }: Props) {
  return (
    <div>
      <h3 className="text-4xl font-bold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export default Heading;
