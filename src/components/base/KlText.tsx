import { Typography } from 'antd';
import type { TextProps } from 'antd/es/typography/Text';
import { memo } from 'react';

const { Text } = Typography;

export const KlText = memo((props: TextProps) => {
  const { children, ...rest } = props;

  return <Text {...rest}>{children}</Text>;
});
