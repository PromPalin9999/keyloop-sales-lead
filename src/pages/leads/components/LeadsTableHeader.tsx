import { FilterOutlined, SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { Checkbox, Dropdown, Input, Popover, Select, type MenuProps } from "antd";
import { memo } from "react";
import type { StaffMember } from "@/apis";
import { KlButton, KlText } from "@/components/base";
import { LEAD_STATUS_META, LEAD_STATUS_OPTIONS, type LeadStatus } from "@/constants";
import type { LeadListSortField } from "@/apis";

type SortValue = { sortBy: LeadListSortField; sortDir: "asc" | "desc" };

const SORT_OPTIONS: Array<SortValue & { label: string }> = [
  { label: "Received: Newest first", sortBy: "created_at", sortDir: "desc" },
  { label: "Received: Oldest first", sortBy: "created_at", sortDir: "asc" },
  { label: "Next follow-up: Soonest", sortBy: "next_follow_up_at", sortDir: "asc" },
  { label: "Customer name: A-Z", sortBy: "customer_name", sortDir: "asc" },
  { label: "Status", sortBy: "status", sortDir: "asc" },
];

interface LeadsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus[];
  onStatusFilterChange: (value: LeadStatus[]) => void;
  isAdmin: boolean;
  ownerFilter: string | undefined;
  onOwnerFilterChange: (value: string | undefined) => void;
  salespeople: StaffMember[];
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
}

export const LeadsTableHeader = memo((props: LeadsTableHeaderProps) => {
  const {
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    isAdmin,
    ownerFilter,
    onOwnerFilterChange,
    salespeople,
    sort,
    onSortChange,
  } = props;

  const activeFilterCount = statusFilter.length + (ownerFilter ? 1 : 0);

  const sortMenuItems: MenuProps["items"] = SORT_OPTIONS.map((option) => ({
    key: `${option.sortBy}:${option.sortDir}`,
    label: option.label,
    onClick: () => onSortChange({ sortBy: option.sortBy, sortDir: option.sortDir }),
  }));

  const filterContent = (
    <div className="w-64">
      <KlText strong className="mb-2 block">
        Status
      </KlText>
      <Checkbox.Group
        className="mb-3 flex flex-col gap-1"
        value={statusFilter}
        onChange={(values) => onStatusFilterChange(values as LeadStatus[])}
        options={LEAD_STATUS_OPTIONS.map((status) => ({
          label: LEAD_STATUS_META[status].label,
          value: status,
        }))}
      />

      {isAdmin && (
        <>
          <KlText strong className="mb-2 block">
            Owner
          </KlText>
          <Select
            allowClear
            className="mb-2 w-full"
            placeholder="All salespeople"
            value={ownerFilter}
            onChange={onOwnerFilterChange}
            options={salespeople.map((person) => ({
              label: person.full_name || person.id,
              value: person.id,
            }))}
          />
        </>
      )}

      {activeFilterCount > 0 && (
        <KlButton
          type="link"
          className="px-0!"
          onClick={() => {
            onStatusFilterChange([]);
            onOwnerFilterChange(undefined);
          }}
        >
          Clear filters
        </KlButton>
      )}
    </div>
  );

  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        allowClear
        size="large"
        className="md:max-w-md"
        placeholder="Search leads, vehicles, or contacts..."
        prefix={<SearchOutlined className="text-text-400" />}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex gap-2 md:ml-auto">
        <Popover content={filterContent} trigger="click" placement="bottomRight">
          <KlButton size="large" icon={<FilterOutlined />}>
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </KlButton>
        </Popover>

        <Dropdown menu={{ items: sortMenuItems, selectedKeys: [`${sort.sortBy}:${sort.sortDir}`] }} trigger={["click"]}>
          <KlButton size="large" icon={<SortAscendingOutlined />}>
            Sort
          </KlButton>
        </Dropdown>
      </div>
    </div>
  );
});
