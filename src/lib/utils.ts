import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const options = { style: 'currency', currency: 'USD' };
export const formatter = new Intl.NumberFormat('en-US', options);
