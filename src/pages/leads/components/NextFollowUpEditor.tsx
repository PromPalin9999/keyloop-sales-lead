import { DatePicker, Form, Input } from 'antd';
import { type Dayjs } from 'dayjs';
import { memo } from 'react';
import { useUpdateNextFollowUp } from '@/apis';
import { KlButton } from '@/components/base';
import { notify } from '@/utils';

interface NextFollowUpEditorProps {
  leadId: string;
}

export const NextFollowUpEditor = memo((props: NextFollowUpEditorProps) => {
  const { leadId } = props;
  const [form] = Form.useForm<FormValues>();

  const { updateNextFollowUp, isUpdatingNextFollowUp } = useUpdateNextFollowUp({
    config: {
      onSuccess: () => {
        form.resetFields();
        notify.success('Next follow-up updated');
      },
    },
  });

  const handleFinish = (values: FormValues) => {
    updateNextFollowUp({
      id: leadId,
      next_follow_up_at: values.date ? values.date.toISOString() : null,
      next_follow_up_note: values.note || null,
    });
  };

  return (
    <div className='pb-3 pt-1'>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        className='flex flex-col gap-2'
      >
        <Form.Item name='date' className='mb-0!'>
          <DatePicker
            showTime
            allowClear
            className='w-full'
            format='MMM D, YYYY hh:mm A'
          />
        </Form.Item>
        <Form.Item name='note' className='mb-0!'>
          <Input.TextArea rows={5} placeholder='Next follow-up note...' />
        </Form.Item>
        <KlButton
          type='primary'
          htmlType='submit'
          loading={isUpdatingNextFollowUp}
          className='mt-4'
        >
          Submit
        </KlButton>
      </Form>
    </div>
  );
});

type FormValues = {
  date: Dayjs | null;
  note: string;
};
