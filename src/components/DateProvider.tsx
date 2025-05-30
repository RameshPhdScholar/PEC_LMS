import React from 'react';

interface DateProviderProps {
  children: React.ReactNode;
}

/**
 * DateProvider component to wrap the application with MUI date picker provider
 * This is a simplified version that just passes children through
 */
export default function DateProvider({ children }: DateProviderProps) {
  return <>{children}</>;
}
