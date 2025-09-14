"use client";

import React from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle } from "lucide-react";
import { PaymentParams } from "@/lib/actions/payments";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { SelectFilter } from "@/components/shared/select-filter";
import { Edit, Trash2, RotateCcw, Filter, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePayments } from "@/hooks/use-payments";
import { paymentStatusOptions } from "@/lib/constant";

export function PaymentsList() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [sort, setSort] = React.useState<PaymentParams["sort"]>("newest");
  const [status, setStatus] = React.useState<PaymentParams["status"]>("ALL");
  const {
    data: paymentsData,
    isFetching,
    refetch,
  } = usePayments({
    params: { q, sort, page, limit, status },
  });

  const payments = paymentsData?.data ?? [];
  const meta = paymentsData?.meta ?? { page, limit, total: 0, totalPages: 1 };

  function handleResetFilter() {
    setQ("");
    setSort("newest");
    setStatus("ALL");
    setPage(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
  }

  function handleSearchInput(query: string) {
    setQ(query);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value as PaymentParams["status"]);
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value as PaymentParams["sort"]);
    setPage(1);
  }

  const handleRefetch = () => {
    refetch();
    toast.success("Payments refreshed successfully");
  };

  const showInfo = () =>
    toast.info("Deletion disabled on DEMO", {
      description: "Please contact developer for full features",
    });

  const isFiltered = q !== "" || sort !== "newest";
  const isEmpty = !isFiltered && meta.total === 0;

  return (
    <>
      <div className="flex items-center justify-between py-6 border-b">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <Book className="h-8 w-8" />
            Payments Management
          </h1>
          <p>Manage and track your payment history</p>
        </div>

        <Button asChild size="sm">
          <Link href="/admin/payments/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Manually Add Payment</span>
          </Link>
        </Button>
      </div>
      <div className="border rounded-md">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-lg font-semibold text-muted-foreground">
              No payments Available
            </span>
          </div>
        ) : (
          <>
            {/* Feature Bar */}
            <div className="py-4 px-2 flex items-center justify-between">
              <SearchInput
                q={q}
                onChange={handleSearchInput}
                placeholder="search by name or email"
              />

              <div className="flex items-center gap-2">
                <SelectFilter
                  options={[
                    { label: "Newest", value: "newest" },
                    { label: "Oldest", value: "oldest" },
                  ]}
                  initialValue={sort}
                  onChange={handleSortChange}
                  placeholder="Sort by"
                />

                <SelectFilter
                  options={paymentStatusOptions}
                  initialValue={status}
                  onChange={handleStatusChange}
                  placeholder="Filter by status"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefetch}
                  title="Refresh"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableCaption className="mt-1">
                {meta.total ? (
                  <Pagination
                    page={meta.page}
                    limit={meta.limit}
                    total={meta.total}
                    onPageChange={handlePageChange}
                  />
                ) : null}
              </TableCaption>
              <TableHeader className="border-t">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {isFetching ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : payments.length > 0 ? (
                  payments.map((p: any) => (
                    <TableRow key={p.id} className="h-12">
                      {/* User */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{p.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {p.user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Invoice */}
                      <TableCell>{p.invoiceNo}</TableCell>

                      {/* Amount */}
                      <TableCell>${p.amount}</TableCell>

                      {/* Method */}
                      <TableCell>{p.paymentMethod}</TableCell>

                      {/* Status */}
                      <TableCell>{p.status}</TableCell>

                      {/* Date */}
                      <TableCell>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Button
                                variant="ghost"
                                className="w-full"
                                onClick={showInfo}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              asChild
                              className="text-destructive"
                            >
                              <Button
                                variant="ghost"
                                className="w-full"
                                onClick={showInfo}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24">
                      <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          No payments Found
                        </span>
                        <Button onClick={handleResetFilter}>
                          <Filter className="mr-1" />
                          Reset Filter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
}
