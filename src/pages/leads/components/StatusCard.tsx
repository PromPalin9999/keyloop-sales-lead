import {
  CalendarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  HeartOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { KlText } from '@/components/base';
import { LEAD_STATUS_META, LeadStatus } from '@/constants';

const STATUS_ICONS: Record<LeadStatus, ReactNode> = {
  [LeadStatus.New]: <ThunderboltOutlined />,
  [LeadStatus.Contacting]: <PhoneOutlined />,
  [LeadStatus.Contacted]: <SolutionOutlined />,
  [LeadStatus.Qualified]: <SafetyCertificateOutlined />,
  [LeadStatus.Appointment]: <CalendarOutlined />,
  [LeadStatus.ProposalNegotiation]: <FileDoneOutlined />,
  [LeadStatus.Won]: <TrophyOutlined />,
  [LeadStatus.Lost]: <CloseCircleOutlined />,
  [LeadStatus.Nurturing]: <HeartOutlined />,
};

// Outcome statuses get a semantic tint; pipeline statuses share one gold
// accent so the picker reads as a restrained, single-accent luxury palette.
const OUTCOME_ICON_TINT: Partial<Record<LeadStatus, string>> = {
  [LeadStatus.Won]: 'text-success',
  [LeadStatus.Lost]: 'text-error',
  [LeadStatus.Nurturing]: 'text-accent-600 dark:text-accent-300',
};

interface StatusCardProps {
  status: LeadStatus;
  selected: boolean;
  index?: number;
  onSelect: (status: LeadStatus) => void;
}

export const StatusCard = (props: StatusCardProps) => {
  const { status, selected, index, onSelect } = props;
  const meta = LEAD_STATUS_META[status];
  const idleTint =
    OUTCOME_ICON_TINT[status] ?? 'text-secondary-600 dark:text-secondary-300';

  return (
    <button
      type='button'
      onClick={() => onSelect(status)}
      className={`group relative flex flex-col items-start gap-2.5 rounded-xl border p-3 text-left transition-all duration-200 ${
        selected
          ? 'border-secondary-400/70 bg-secondary-400/10 shadow-[0_0_0_1px_rgba(242,150,13,0.35),0_8px_24px_-8px_rgba(242,150,13,0.45)]'
          : 'border-text-900/10 bg-text-900/[0.02] hover:border-text-900/20 hover:bg-text-900/[0.05] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.07]'
      }`}
    >
      {!!index && (
        <span className='text-text-400 absolute top-2.5 right-2.5 font-mono text-[10px] dark:text-white/25'>
          {String(index).padStart(2, '0')}
        </span>
      )}

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-colors ${
          selected
            ? 'bg-secondary-400/20 text-secondary-600 dark:text-secondary-300'
            : `bg-text-900/5 dark:bg-white/5 ${idleTint}`
        }`}
      >
        {STATUS_ICONS[status]}
      </span>

      <KlText
        className={`text-[13px]! leading-tight! font-medium! ${
          selected
            ? 'text-text! dark:text-white!'
            : 'text-text-600! dark:text-white/80!'
        }`}
      >
        {meta.label}
      </KlText>

      {selected && (
        <CheckOutlined className='text-secondary-600! dark:text-secondary-300! absolute right-2.5 bottom-2.5 text-xs!' />
      )}
    </button>
  );
};
