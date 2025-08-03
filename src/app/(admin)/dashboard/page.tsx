"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Loader2Icon
} from "lucide-react";
import { useEffect, useState } from "react";

import { columns } from "./column";

import { useBlockControllerPagination } from "@/api";
import {
  BlockControllerPagination200AllOf,
  GetBlockResponseDto
} from "@/api/schemas";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const PageSizeOptions = [10, 20, 30, 40, 50];

export default function DataTableDemo() {
  const [data, setData] = useState<BlockControllerPagination200AllOf>({
    data: {
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0
    }
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PageSizeOptions[0]
  });

  const [filterName, setFilterName] = useState("");

  const { mutate, isPending } = useBlockControllerPagination({
    mutation: {
      onSuccess: (data: BlockControllerPagination200AllOf) => {
        setData(data);
      },
      onError: (error: any) => {}
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      mutate({
        data: {
          name: filterName
        },
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize
        }
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [pagination, filterName]);

  const table = useReactTable<GetBlockResponseDto>({
    data: data?.data?.items ?? [],
    columns,
    pageCount: Math.ceil((data?.data?.total ?? 0) / pagination.pageSize),
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2">
          <Input
            className="max-w-sm"
            disabled={isPending}
            placeholder="Tìm kiếm theo tên..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          {filterName && <CircleX onClick={() => setFilterName("")} />}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    className="capitalize"
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center justify-center">
                    <Loader2Icon className="animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                      colSpan={columns.length}
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <div className="flex items-center justify-between px-4">
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label className="text-sm font-medium" htmlFor="rows-per-page">
                  Rows per page
                </Label>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(value),
                      pageIndex: 0
                    }));
                  }}
                >
                  <SelectTrigger className="w-20" id="rows-per-page">
                    <SelectValue placeholder={pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {PageSizeOptions.map((value) => (
                      <SelectItem key={value} value={`${value}`}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {pagination.pageIndex + 1} of {data.data?.totalPages || 0}{" "}
                ({data.data?.total || 0} items)
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  className="hidden h-8 w-8 p-0 lg:flex"
                  disabled={!table.getCanPreviousPage()}
                  variant="outline"
                  onClick={() => table.setPageIndex(0)}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  className="size-8"
                  disabled={!table.getCanPreviousPage()}
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button
                  className="size-8"
                  disabled={!table.getCanNextPage()}
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  className="hidden size-8 lg:flex"
                  disabled={!table.getCanNextPage()}
                  size="icon"
                  variant="outline"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
