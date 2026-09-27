import React from 'react';
import './Skeleton.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'rounded';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rect',
  className = '',
  style = {},
}) => {
  const inlineStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  const classes = [
    'nocturne-skeleton',
    variant === 'circle' ? 'nocturne-skeleton--circle' : '',
    variant === 'rounded' ? 'nocturne-skeleton--rounded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} style={inlineStyles} aria-hidden="true" />;
};
