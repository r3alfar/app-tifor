import { BiSolidFileExport } from "react-icons/bi";

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

interface DataTableExportActionProps<TData> {
  table: Table<TData>
}

function DataTableExportAction<TData>({
  table,
}: DataTableExportActionProps<TData>
) {

  const handleExport = () => {
    // Implement your export logic here
    // You can use table.getFilteredSelectedRowModel() to get the selected rows
    // and perform the necessary operations to export the data
    // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table;

    const tableData = table.getFilteredRowModel().rows.map((row) => row.original);
    console.log(tableData)

    const csv = Papa.unparse(tableData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  return (
    <Button variant={"outline"} size={"sm"} onClick={() => handleExport()}>
      <BiSolidFileExport className="mr-2 h-4 w-4" />
      Export
    </Button>
  )
}

export default DataTableExportAction