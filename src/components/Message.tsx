import { message } from 'antd';
import { useEffect, type ReactNode } from 'react';
import { type ICustomerMessageProps, MESSAGE_EVENT_NAME } from '@/utils';

type ShorthandMessageFn = (
  content: ReactNode,
  duration?: number | VoidFunction,
  onClose?: VoidFunction,
) => void;

const Message = () => {
  const [api, contextHolder] = message.useMessage();

  useEffect(() => {
    const bindEvent = (event: Event) => {
      const e = event as CustomEvent<ICustomerMessageProps>;
      const { type, duration, onClose, icon } = e.detail;
      // Every caller in this app (message.*/notify.*) always dispatches a
      // ReactNode, never antd's raw ArgsProps object shape.
      const content = e.detail.content as ReactNode;

      if (icon) {
        api[type]({
          content,
          duration: duration as number | undefined,
          onClose,
          icon,
        });
      } else {
        (api[type] as ShorthandMessageFn)(content, duration, onClose);
      }
    };

    window.addEventListener(MESSAGE_EVENT_NAME, bindEvent);

    return () => {
      window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent);
    };
  }, [api]);

  return <>{contextHolder}</>;
};

export default Message;
