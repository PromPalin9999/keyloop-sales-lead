import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatReceivedAt = (iso: string): string => {
  const date = dayjs(iso);
  const now = dayjs();

  if (date.isSame(now, "day")) return `Today, ${date.format("hh:mm A")}`;
  if (date.isSame(now.subtract(1, "day"), "day")) {
    return `Yesterday, ${date.format("hh:mm A")}`;
  }
  return date.format("MMM D, YYYY");
};

export const formatShortDate = (iso: string): string =>
  dayjs(iso).format("MMM D, YYYY");

export const formatDateTime = (iso: string): string =>
  dayjs(iso).format("MMM D, hh:mm A");

export const formatRelativeTime = (iso: string): string => dayjs(iso).fromNow();

export const isOverdue = (iso: string): boolean => dayjs(iso).isBefore(dayjs());
