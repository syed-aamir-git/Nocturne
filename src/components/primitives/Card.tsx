import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'flat',
  interactive = false,
  className = '',
  ...props
}) => {
  const classes = [
    'nocturne-card',
    `nocturne-card--${variant}`,
    interactive ? 'nocturne-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
