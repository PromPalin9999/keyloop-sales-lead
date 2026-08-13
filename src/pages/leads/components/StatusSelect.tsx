import { EditOutlined } from '@ant-design/icons';
import { memo, useState } from 'react';
import { StatusPickerModal } from './StatusPickerModal';
import { LEAD_STATUS_META, type LeadStatus } from '@/constants';

interface StatusSelectProps {
  leadId: string;
  status: LeadStatus;
  disabled?: boolean;
}

export const StatusSelect = memo((props: StatusSelectProps) => {
  const { leadId, status, disabled } = props;
  const [open, setOpen] = useState(false);
  const meta = LEAD_STATUS_META[status];

  return (
    <>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`group flex items-center gap-2 rounded-full border px-1 py-1 pr-3 transition-all ${
          disabled
            ? 'border-text-200/40 cursor-not-allowed opacity-60'
            : 'border-secondary-400/40 hover:border-secondary-400 hover:shadow-[0_0_0_3px_rgba(242,150,13,0.12)]'
        }`}
      >
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${meta.className}`}
        >
          {meta.label}
        </span>
        <EditOutlined
          className={`text-xs! transition-colors ${
            disabled
              ? 'text-text-300'
              : 'text-text-400 group-hover:text-secondary-500'
          }`}
        />
      </button>

      <StatusPickerModal
        open={open}
        onClose={() => setOpen(false)}
        leadId={leadId}
        status={status}
      />
    </>
  );
});
