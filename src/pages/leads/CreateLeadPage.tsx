import { Form, Input, Select, Space } from 'antd';
import { useCallback } from 'react';
import { AssignToField } from './components/AssignToField';
import { useCreateLead, type CreateLeadPayload } from '@/apis';
import { PageBreadcrumb } from '@/components';
import { KlButton, KlCard, KlText, KlTitle } from '@/components/base';
import { DEFAULT_DIAL_CODE, DIAL_CODES } from '@/constants';
import { notify } from '@/utils';

type CreateLeadFormValues = Omit<CreateLeadPayload, 'phone'> & {
  countryCode: string;
  phoneNum: string;
};

const CreateLeadPage = () => {
  const [form] = Form.useForm<CreateLeadFormValues>();

  const { createLead, isCreatingLead } = useCreateLead({
    config: {
      onSuccess: () => {
        notify.success('Lead created');
        form.resetFields();
      },
    },
  });

  const handleSubmit = useCallback(
    (values: CreateLeadFormValues) => {
      const { countryCode, phoneNum, ...rest } = values;
      createLead({ ...rest, phone: `${countryCode}${phoneNum}` });
    },
    [createLead],
  );

  return (
    <>
      <PageBreadcrumb page='Create New Lead' />

      <KlCard
        title={
          <div className='mt-5'>
            <KlTitle level={3} className='mb-1!'>
              Create New Lead
            </KlTitle>
            <KlText type='secondary' className='mb-6! block!'>
              Enter prospect details to initiate the sales pipeline.
            </KlText>
          </div>
        }
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            assigned_to: null,
            countryCode: DEFAULT_DIAL_CODE,
          }}
        >
          <div className='grid grid-cols-1 gap-x-6 md:grid-cols-2'>
            <Form.Item
              name='customer_name'
              label='Customer Name'
              rules={[
                {
                  required: true,
                  message: "Please enter the customer's name",
                },
              ]}
            >
              <Input placeholder='Jane Doe' />
            </Form.Item>

            <Form.Item
              name='email'
              label='Email Address'
              rules={[
                { required: true, message: 'Please enter an email address' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder='jane@example.com' />
            </Form.Item>

            <Form.Item label='Phone Number' required>
              <Space.Compact className='w-full'>
                <Form.Item
                  name='countryCode'
                  noStyle
                  rules={[
                    { required: true, message: 'Please select a country code' },
                  ]}
                >
                  <Select
                    style={{ width: 80 }}
                    popupMatchSelectWidth={false}
                    options={DIAL_CODES.map((dial) => ({
                      value: dial.code,
                      label: dial.code,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name='phoneNum'
                  noStyle
                  normalize={(input: string) =>
                    input.replace(/\D/g, '').slice(0, 11)
                  }
                  rules={[
                    { required: true, message: 'Please enter a phone number' },
                    {
                      pattern: /^[0-9]{9,11}$/,
                      message: 'Please enter a valid phone number',
                    },
                  ]}
                >
                  <Input inputMode='numeric' placeholder='912345678' />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name='vehicle_interest'
              label='Vehicle Interest'
              rules={[
                {
                  required: true,
                  message: 'Please enter the vehicle of interest',
                },
              ]}
            >
              <Input placeholder='Toyota Camry' />
            </Form.Item>
          </div>

          <Form.Item
            name='assigned_to'
            label='Assign To'
            rules={[{ required: true, message: 'Please assign this lead' }]}
          >
            <AssignToField />
          </Form.Item>

          <Form.Item name='message' label='Initial Message / Notes'>
            <Input.TextArea
              rows={4}
              placeholder='Any specific requirements or initial questions from the prospect...'
            />
          </Form.Item>

          <Form.Item className='mt-10!'>
            <div className='flex justify-end gap-2'>
              <KlButton
                type='primary'
                htmlType='submit'
                loading={isCreatingLead}
              >
                Create Lead
              </KlButton>
            </div>
          </Form.Item>
        </Form>
      </KlCard>
    </>
  );
};

export default CreateLeadPage;
