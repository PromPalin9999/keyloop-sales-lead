import { Form, Input } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLead, type CreateLeadPayload } from "@/apis";
import { KlButton, KlCard, KlTitle } from "@/components/base";
import { buildLeadDetailRoute } from "@/constants";
import { notify } from "@/utils";

const CreateLeadPage = () => {
  const [form] = Form.useForm<CreateLeadPayload>();
  const navigate = useNavigate();

  const { createLead, isCreatingLead } = useCreateLead({
    config: {
      onSuccess: (lead) => {
        notify.success("Lead created");
        navigate(buildLeadDetailRoute(lead.id));
      },
    },
  });

  const handleSubmit = useCallback(
    (values: CreateLeadPayload) => createLead(values),
    [createLead],
  );

  return (
    <>
      <KlTitle level={3} className="mb-6!">
        Create Lead
      </KlTitle>

      <KlCard className="max-w-xl">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customer_name"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter the customer's name" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input placeholder="customer@example.com" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="+84 912 345 678" />
          </Form.Item>

          <Form.Item
            name="vehicle_interest"
            label="Vehicle Interest"
            rules={[{ required: true, message: "Please enter the vehicle of interest" }]}
          >
            <Input placeholder="Toyota Camry" />
          </Form.Item>

          <Form.Item name="message" label="Message">
            <Input.TextArea rows={3} placeholder="Notes from the customer..." />
          </Form.Item>

          <Form.Item className="mb-0!">
            <KlButton type="primary" htmlType="submit" loading={isCreatingLead}>
              Create Lead
            </KlButton>
          </Form.Item>
        </Form>
      </KlCard>
    </>
  );
};

export default CreateLeadPage;
