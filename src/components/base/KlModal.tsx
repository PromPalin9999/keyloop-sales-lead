import { Modal, type ModalProps } from 'antd';

export const KlModal = (props: ModalProps) => {
  const { children, ...rest } = props;

  return <Modal {...rest}>{children}</Modal>;
};
