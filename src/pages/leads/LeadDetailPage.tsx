import { ArrowLeftOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Result, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useLead, useLeadActivities, useStaffDirectory } from "@/apis";
import { KlCard, KlText, KlTitle } from "@/components/base";
import { PrefetchLink } from "@/components";
import { Role, ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { formatShortDate } from "@/utils";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { AssignLeadControl } from "./components/AssignLeadControl";
import { LogActivityForm } from "./components/LogActivityForm";
import { NextFollowUpEditor } from "./components/NextFollowUpEditor";
import { StatusSelect } from "./components/StatusSelect";
import { StatusTag } from "./components/StatusTag";

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const isAdmin = useAuthStore((state) => state.profile?.role === Role.Admin);

  const { lead, isGettingLead, isError } = useLead(id);
  const { activities, isGettingActivities } = useLeadActivities(id);
  const { staffById } = useStaffDirectory();

  if (isGettingLead) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError || !lead) {
    return (
      <Result
        status="404"
        title="Lead not found"
        subTitle="This lead doesn't exist, or you don't have access to it."
        extra={
          <PrefetchLink to={ROUTES.LEADS}>
            <ArrowLeftOutlined /> Back to Lead Inbox
          </PrefetchLink>
        }
      />
    );
  }

  const creatorName = lead.created_by
    ? staffById.get(lead.created_by)?.full_name || "--"
    : "Website";

  return (
    <>
      <PrefetchLink to={ROUTES.LEADS} className="mb-4 inline-flex items-center gap-1 !text-text-500">
        <ArrowLeftOutlined /> Back to Lead Inbox
      </PrefetchLink>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <KlTitle level={3} className="mb-1!">
            {lead.customer_name}
          </KlTitle>
          <StatusTag status={lead.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <KlCard title="Activity Timeline">
            <ActivityTimeline
              activities={activities}
              staffById={staffById}
              isLoading={isGettingActivities}
            />
            <LogActivityForm leadId={lead.id} />
          </KlCard>
        </div>

        <div className="flex flex-col gap-6">
          <KlCard title="Customer">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <MailOutlined className="text-text-400" />
                <KlText>{lead.email || "--"}</KlText>
              </span>
              <span className="flex items-center gap-2">
                <PhoneOutlined className="text-text-400" />
                <KlText>{lead.phone || "--"}</KlText>
              </span>
            </div>
          </KlCard>

          <KlCard title="Lead">
            <div className="flex flex-col gap-3">
              <div>
                <KlText type="secondary" className="!text-xs">
                  Vehicle Interest
                </KlText>
                <KlText className="block">{lead.vehicle_interest}</KlText>
              </div>
              {lead.message && (
                <div>
                  <KlText type="secondary" className="!text-xs">
                    Message
                  </KlText>
                  <KlText className="block whitespace-pre-wrap">{lead.message}</KlText>
                </div>
              )}
              <div>
                <KlText type="secondary" className="!text-xs">
                  Source
                </KlText>
                <KlText className="block">{lead.source}</KlText>
              </div>
              <div>
                <KlText type="secondary" className="!text-xs">
                  Received
                </KlText>
                <KlText className="block">{formatShortDate(lead.created_at)}</KlText>
              </div>
              <div>
                <KlText type="secondary" className="!text-xs">
                  Created By
                </KlText>
                <KlText className="block">{creatorName}</KlText>
              </div>
              <div>
                <KlText type="secondary" className="mb-1 !text-xs">
                  Status
                </KlText>
                <StatusSelect leadId={lead.id} status={lead.status} />
              </div>
              {isAdmin && (
                <div>
                  <KlText type="secondary" className="mb-1 !text-xs">
                    Assigned Salesperson
                  </KlText>
                  <AssignLeadControl leadId={lead.id} assignedTo={lead.assigned_to} />
                </div>
              )}
            </div>
          </KlCard>

          <KlCard title="Next Follow-up">
            <NextFollowUpEditor
              leadId={lead.id}
              nextFollowUpAt={lead.next_follow_up_at}
              nextFollowUpNote={lead.next_follow_up_note}
            />
          </KlCard>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPage;
