import React from 'react';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function Image({
  src,
  alt = '',
  width,
  height,
  fill,
  className,
  priority,
  unoptimized,
  style,
  ...props
}: ImageProps) {
  const imageSrc = typeof src === 'object' && src !== null && 'src' in src ? src.src : (src as string);
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ ...fillStyle, ...style }}
      {...props}
    />
  );
}
