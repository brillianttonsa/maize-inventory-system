import type { ReactNode } from 'react';

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardSectionProps) => (
  <div className={`rounded-lg bg-white text-gray-900 shadow-md transition-all ${className}`}>{children}</div>
);

Card.Header = ({ children, className = '' }: CardSectionProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

Card.Title = ({ children, className = '' }: CardSectionProps) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

Card.Description = ({ children, className = '' }: CardSectionProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

Card.Content = ({ children, className = '' }: CardSectionProps) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
