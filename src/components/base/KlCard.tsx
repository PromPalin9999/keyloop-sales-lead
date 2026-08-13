import { Card, type CardProps } from 'antd';
import { memo } from 'react';

export const KlCard = memo((props: CardProps) => {
  const { className, children, ...rest } = props;

  return (
    <Card className={`border-none! bg-primary! ${className}`} {...rest}>
      {children}
    </Card>
  );
});
