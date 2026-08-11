import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';
import { memo } from 'react';

const { Title } = Typography;

export const KlTitle = memo((props: TitleProps) => {
  const { children, ...rest } = props;

  return <Title {...rest}>{children}</Title>;
});
