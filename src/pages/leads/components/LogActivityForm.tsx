import { Form, Input, Select } from "antd";
import { memo, useCallback } from "react";
import { useCreateActivity } from "@/apis";
import { KlButton } from "@/components/base";
import { ACTIVITY_TYPE_LABELS, ActivityType, LOGGABLE_ACTIVITY_TYPES } from "@/constants";
import { notify } from "@/utils";
import type { CreateActivityPayload } from "@/apis";

interface LogActivityFormProps {
  leadId: string;
}

type FormValues = {
  type: CreateActivityPayload["type"];
  note?: string;
};

export const LogActivityForm = memo((props: LogActivityFormProps) => {
  const { leadId } = props;
  const [form] = Form.useForm<FormValues>();

  const { createActivity, isCreatingActivity } = useCreateActivity({
    config: {
      onSuccess: () => {
        form.resetFields();
        notify.success("Activity logged");
      },
    },
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      createActivity({
        lead_id: leadId,
        type: values.type,
        note: values.note || null,
      });
    },
    [leadId, createActivity],
  );

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ type: ActivityType.Call }}
      onFinish={handleSubmit}
      className="mt-4"
    >
      <div className="flex flex-col gap-3 md:flex-row">
        <Form.Item name="type" className="mb-0! md:w-48" rules={[{ required: true }]}>
          <Select
            options={LOGGABLE_ACTIVITY_TYPES.map((type) => ({
              label: ACTIVITY_TYPE_LABELS[type],
              value: type,
            }))}
          />
        </Form.Item>
        <Form.Item name="note" className="mb-0! flex-1">
          <Input.TextArea rows={1} placeholder="Add a note about this activity..." autoSize />
        </Form.Item>
        <KlButton type="primary" htmlType="submit" loading={isCreatingActivity}>
          Log
        </KlButton>
      </div>
    </Form>
  );
});
