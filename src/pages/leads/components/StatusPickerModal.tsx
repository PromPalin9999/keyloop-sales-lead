import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { StatusCard } from './StatusCard';
import { useUpdateLeadStatus } from '@/apis';
import { KlButton, KlModal, KlText, KlTitle } from '@/components/base';
import { LEAD_STATUS_META, LeadStatus } from '@/constants';
import { notify } from '@/utils';

const PIPELINE_STATUSES: LeadStatus[] = [
  LeadStatus.New,
  LeadStatus.Contacting,
  LeadStatus.Contacted,
  LeadStatus.Qualified,
  LeadStatus.Appointment,
  LeadStatus.ProposalNegotiation,
];

const OUTCOME_STATUSES: LeadStatus[] = [
  LeadStatus.Won,
  LeadStatus.Lost,
  LeadStatus.Nurturing,
];

interface StatusPickerModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  status: LeadStatus;
}

export const StatusPickerModal = (props: StatusPickerModalProps) => {
  const { open, onClose, leadId, status } = props;
  const [selected, setSelected] = useState<LeadStatus>(status);

  useEffect(() => {
    if (open) setSelected(status);
  }, [open, status]);

  const { updateLeadStatus, isUpdatingLeadStatus } = useUpdateLeadStatus({
    config: {
      onSuccess: () => {
        notify.success('Status updated');
        onClose();
      },
    },
  });

  const hasChange = selected !== status;

  return (
    <KlModal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      destroyOnHidden
      centered
      width={560}
      mask={{ closable: false }}
      keyboard={false}
      closeIcon={
        <span className='text-text-500 hover:bg-text-900/10 hover:text-text flex h-7 w-7 items-center justify-center rounded-full bg-text-900/5 transition-colors dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 dark:hover:text-white'>
          <CloseOutlined className='text-xs!' />
        </span>
      }
      classNames={{
        container:
          'p-0! overflow-hidden! rounded-2xl! border! border-secondary-500/25! dark:border-secondary-400/25! shadow-[0_20px_50px_-12px_rgba(20,10,30,0.18)]! dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]!',
        body: 'p-0!',
      }}
    >
      <div className='from-background to-secondary-50/50 dark:from-background-950 dark:to-background-900 relative bg-gradient-to-b'>
        <div className='text-text-900 pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:22px_22px] dark:text-white dark:opacity-[0.05]' />

        <div className='border-text-900/10 relative border-b px-6 py-5 dark:border-white/10'>
          <span className='text-secondary-600 dark:text-secondary-300 text-[11px] font-semibold tracking-[0.2em] uppercase'>
            Pipeline Control
          </span>
          <KlTitle
            level={4}
            className='text-text! mt-1! mb-0! dark:text-white!'
          >
            Update Lead Status
          </KlTitle>
          <KlText className='text-text-500! text-[12px]! dark:text-white/50!'>
            Move this lead forward, or mark its final outcome.
          </KlText>
        </div>

        <div className='relative max-h-[60vh] overflow-y-auto px-6 py-5'>
          <div className='mb-3 flex items-center gap-2'>
            <span className='bg-text-900/10 h-px flex-1 dark:bg-white/10' />
            <span className='text-text-400 text-[10px] font-semibold tracking-widest uppercase dark:text-white/40'>
              Pipeline
            </span>
            <span className='bg-text-900/10 h-px flex-1 dark:bg-white/10' />
          </div>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {PIPELINE_STATUSES.map((s, i) => (
              <StatusCard
                key={s}
                status={s}
                index={i + 1}
                selected={selected === s}
                onSelect={setSelected}
              />
            ))}
          </div>

          <div className='my-4 flex items-center gap-2'>
            <span className='bg-text-900/10 h-px flex-1 dark:bg-white/10' />
            <span className='text-text-400 text-[10px] font-semibold tracking-widest uppercase dark:text-white/40'>
              Outcome
            </span>
            <span className='bg-text-900/10 h-px flex-1 dark:bg-white/10' />
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {OUTCOME_STATUSES.map((s) => (
              <StatusCard
                key={s}
                status={s}
                selected={selected === s}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>

        <div className='border-text-900/10 bg-text-900/[0.02] relative flex items-center justify-between gap-3 border-t px-6 py-4 dark:border-white/10 dark:bg-black/20'>
          <KlText className='text-text-500! text-[12px]! dark:text-white/40!'>
            Current:
            <span className='text-text! dark:text-white/70! ml-1!'>
              {LEAD_STATUS_META[status].label}
            </span>
          </KlText>

          <div className='flex gap-2'>
            <KlButton
              type='text'
              onClick={onClose}
              className='text-text-500! hover:text-text! hover:bg-text-900/5! dark:text-white/60! dark:hover:bg-white/10! dark:hover:text-white!'
            >
              Cancel
            </KlButton>
            <KlButton
              loading={isUpdatingLeadStatus}
              disabled={!hasChange}
              onClick={() => updateLeadStatus({ id: leadId, status: selected })}
              className={
                hasChange
                  ? 'from-secondary-400! to-secondary-600! text-text-950! border-none! bg-gradient-to-r! font-semibold! shadow-[0_0_20px_rgba(242,150,13,0.35)]!'
                  : 'bg-text-900/10! text-text-400! dark:bg-white/10! dark:text-white/30! border-none!'
              }
            >
              Confirm Update
            </KlButton>
          </div>
        </div>
      </div>
    </KlModal>
  );
};
