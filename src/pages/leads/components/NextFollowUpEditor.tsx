import { DatePicker, Input } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { memo, useCallback, useEffect, useState } from "react";
import { useUpdateNextFollowUp } from "@/apis";
import { KlButton } from "@/components/base";
import { notify } from "@/utils";

interface NextFollowUpEditorProps {
  leadId: string;
  nextFollowUpAt: string | null;
  nextFollowUpNote: string | null;
}

export const NextFollowUpEditor = memo((props: NextFollowUpEditorProps) => {
  const { leadId, nextFollowUpAt, nextFollowUpNote } = props;

  const [date, setDate] = useState<Dayjs | null>(
    nextFollowUpAt ? dayjs(nextFollowUpAt) : null,
  );
  const [note, setNote] = useState(nextFollowUpNote ?? "");

  useEffect(() => {
    setDate(nextFollowUpAt ? dayjs(nextFollowUpAt) : null);
    setNote(nextFollowUpNote ?? "");
  }, [nextFollowUpAt, nextFollowUpNote]);

  const { updateNextFollowUp, isUpdatingNextFollowUp } = useUpdateNextFollowUp({
    config: {
      onSuccess: () => notify.success("Next follow-up updated"),
    },
  });

  const handleSave = useCallback(() => {
    updateNextFollowUp({
      id: leadId,
      next_follow_up_at: date ? date.toISOString() : null,
      next_follow_up_note: note || null,
    });
  }, [leadId, date, note, updateNextFollowUp]);

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        showTime
        allowClear
        className="w-full"
        format="MMM D, YYYY hh:mm A"
        value={date}
        onChange={setDate}
      />
      <Input.TextArea
        rows={2}
        placeholder="Next follow-up note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <KlButton
        type="primary"
        loading={isUpdatingNextFollowUp}
        onClick={handleSave}
        className="self-start"
      >
        Save
      </KlButton>
    </div>
  );
});
