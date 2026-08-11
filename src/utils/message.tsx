import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import { type JointContent } from "antd/es/message/interface";
import type { ReactNode } from "react";
import { KlText, KlTitle } from "@/components/base";

export const MESSAGE_EVENT_NAME = "app-message";
export enum MESSAGE_TYPES {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  LOADING = "loading",
}

export interface ICustomerMessageProps {
  type: MESSAGE_TYPES;
  content: JointContent;
  duration?: number | VoidFunction;
  onClose?: VoidFunction;
  icon?: ReactNode;
}

const dispatch = (props: ICustomerMessageProps) => {
  window.dispatchEvent(
    new CustomEvent<ICustomerMessageProps>(MESSAGE_EVENT_NAME, {
      detail: {
        ...props,
      },
    }),
  );
};

export const message = {
  success(
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({ type: MESSAGE_TYPES.SUCCESS, content, duration, onClose });
  },
  error(
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({ type: MESSAGE_TYPES.ERROR, content, duration, onClose });
  },
  info(
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({ type: MESSAGE_TYPES.INFO, content, duration, onClose });
  },
  warning(
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({ type: MESSAGE_TYPES.WARNING, content, duration, onClose });
  },
  loading(
    content: JointContent,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({ type: MESSAGE_TYPES.LOADING, content, duration, onClose });
  },
};

type NotifyType = "success" | "error" | "warning" | "info";

const NOTIFY_ICONS: Record<NotifyType, ReactNode> = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  info: <InfoCircleFilled />,
};

const buildNotifyContent = (
  type: NotifyType,
  title: string,
  description?: string,
) => (
  <div className="text-left">
    <KlTitle level={5} className="mb-0! flex items-center gap-2">
      <span className={`text-${type}`}>{NOTIFY_ICONS[type]}</span>
      {title}
    </KlTitle>
    {description && (
      <>
        <hr className="my-2 border-text-200" />
        <KlText>{description}</KlText>
      </>
    )}
  </div>
);

// Same event-driven pipeline as `message`, with a title/description/icon
// card layout instead of a plain string. antd's default icon is suppressed
// (empty `icon`) since the layout already renders its own.
export const notify = {
  success(
    title: string,
    description?: string,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({
      type: MESSAGE_TYPES.SUCCESS,
      content: buildNotifyContent("success", title, description),
      duration,
      onClose,
      icon: <span />,
    });
  },
  error(
    title: string,
    description?: string,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({
      type: MESSAGE_TYPES.ERROR,
      content: buildNotifyContent("error", title, description),
      duration,
      onClose,
      icon: <span />,
    });
  },
  warning(
    title: string,
    description?: string,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({
      type: MESSAGE_TYPES.WARNING,
      content: buildNotifyContent("warning", title, description),
      duration,
      onClose,
      icon: <span />,
    });
  },
  info(
    title: string,
    description?: string,
    duration?: number | VoidFunction,
    onClose?: VoidFunction,
  ) {
    dispatch({
      type: MESSAGE_TYPES.INFO,
      content: buildNotifyContent("info", title, description),
      duration,
      onClose,
      icon: <span />,
    });
  },
};
