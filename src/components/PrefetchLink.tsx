import { memo } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { routePreloaders } from '@/utils';

export const PrefetchLink = memo((props: LinkProps) => {
  const { to, onMouseEnter, onFocus, ...rest } = props;
  const href = typeof to === 'string' ? to.split('?')[0] : (to.pathname ?? '');

  const preload = () => {
    const loader = routePreloaders[href];
    if (loader) loader();
  };

  return (
    <Link
      to={to}
      onMouseEnter={(e) => {
        preload();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        preload();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
});
