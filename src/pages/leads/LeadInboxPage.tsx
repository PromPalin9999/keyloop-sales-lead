import { useEffect, useState } from "react";
import { useLeads, useSalespeople } from "@/apis";
import type { LeadListSortField } from "@/apis";
import { KlCard, KlText, KlTitle } from "@/components/base";
import { Role } from "@/constants";
import { useDebouncedValue, usePaginationStates } from "@/hooks";
import { useAuthStore } from "@/store";
import type { LeadStatus } from "@/constants";
import { LeadsPagination } from "./components/LeadsPagination";
import { LeadsTable } from "./components/LeadsTable";
import { LeadsTableHeader } from "./components/LeadsTableHeader";

const LeadInboxPage = () => {
  const isAdmin = useAuthStore((state) => state.profile?.role === Role.Admin);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<string | undefined>();
  const [sort, setSort] = useState<{
    sortBy: LeadListSortField;
    sortDir: "asc" | "desc";
  }>({ sortBy: "created_at", sortDir: "desc" });

  const { pageNumber, setPageNumber, pageSize } = usePaginationStates(1, 10);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearch, statusFilter, ownerFilter, sort, setPageNumber]);

  const { leads, isGettingLeads } = useLeads({
    search: debouncedSearch || undefined,
    status: statusFilter.length ? statusFilter : undefined,
    assignedTo: ownerFilter,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
    page: pageNumber,
    pageSize,
  });

  const { salespeople, staffById } = useSalespeople();

  return (
    <>
      <KlTitle level={3} className="mb-0!">
        Lead Inbox
      </KlTitle>
      <KlText type="secondary" className="mb-6 block">
        Manage and track in-flight prospects across the floor.
      </KlText>

      <LeadsTableHeader
        search={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isAdmin={isAdmin}
        ownerFilter={ownerFilter}
        onOwnerFilterChange={setOwnerFilter}
        salespeople={salespeople}
        sort={sort}
        onSortChange={setSort}
      />

      <KlCard styles={{ body: { padding: 0 } }}>
        <LeadsTable
          leads={leads?.items ?? []}
          staffById={staffById}
          isLoading={isGettingLeads}
        />
        <LeadsPagination
          page={pageNumber}
          pageSize={pageSize}
          total={leads?.total ?? 0}
          onPageChange={setPageNumber}
        />
      </KlCard>
    </>
  );
};

export default LeadInboxPage;
