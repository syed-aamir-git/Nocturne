import React, { useState } from 'react';
import './Avatar.css';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  ring = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const classes = [
    'nocturne-avatar',
    `nocturne-avatar--${size}`,
    ring ? 'nocturne-avatar--ring' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} title={name}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <span className="nocturne-avatar-fallback">{getInitials(name)}</span>
      )}
    </div>
  );
};
