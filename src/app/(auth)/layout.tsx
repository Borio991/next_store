import React from 'react';

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex justify-center items-center h-screen w-screen">{children}</div>;
}

export default layout;
