import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
  replace?: boolean;
  to?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, to, children, ...props }, ref) => {
  const target = href || to || '#';
  return (
    <RouterLink ref={ref} to={target} {...props}>
      {children}
    </RouterLink>
  );
});

Link.displayName = 'Link';
export default Link;
