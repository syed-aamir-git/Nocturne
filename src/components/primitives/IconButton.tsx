import React from 'react';
import './IconButton.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'primary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  active = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const classes = [
    'nocturne-icon-btn',
    `nocturne-icon-btn--${variant}`,
    `nocturne-icon-btn--${size}`,
    active ? 'nocturne-icon-btn--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
};
