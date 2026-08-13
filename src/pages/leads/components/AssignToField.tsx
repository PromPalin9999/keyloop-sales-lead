import { CloseCircleFilled, UserAddOutlined } from '@ant-design/icons';
import { memo, useState } from 'react';
import { SelectAssigneeModal } from './SelectAssigneeModal';
import { useStaffDirectory } from '@/apis';
import { KlText } from '@/components/base';

interface AssignToFieldProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
}

// Antd Form-compatible control (accepts value/onChange) so it can be used
// as `<Form.Item name="assigned_to"><AssignToField /></Form.Item>` -- the
// picked salesperson is stored on the form and submitted with CreateLead.
export const AssignToField = memo((props: AssignToFieldProps) => {
  const { value = null, onChange } = props;
  const [open, setOpen] = useState(false);
  const { staffById } = useStaffDirectory();

  const assignedName = value
    ? staffById.get(value)?.full_name || '--'
    : 'Unassigned (Queue)';

  return (
    <div className='border-text-200/30 flex w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5'>
      <KlText className={!value ? 'text-text-400!' : undefined}>
        {assignedName}
      </KlText>
      {value ? (
        <CloseCircleFilled
          className='text-text-400 hover:text-text-600 text-sm!'
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(null);
          }}
        />
      ) : (
        <button type='button' onClick={() => setOpen(true)}>
          <UserAddOutlined className='text-text-400 text-xl!' />
        </button>
      )}

      <SelectAssigneeModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        onSelect={(id) => onChange?.(id)}
      />
    </div>
  );
});
