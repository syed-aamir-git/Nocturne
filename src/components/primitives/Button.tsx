import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gothic';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const classes = [
    'nocturne-button',
    `nocturne-button--${variant}`,
    `nocturne-button--${size}`,
    fullWidth ? 'nocturne-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {leftIcon && <span className="nocturne-button__icon-left">{leftIcon}</span>}
      <span className="nocturne-button__content">{children}</span>
      {rightIcon && <span className="nocturne-button__icon-right">{rightIcon}</span>}
    </button>
  );
};
