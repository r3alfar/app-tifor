import { BiSolidFileExport } from "react-icons/bi";

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
// import Papa from "papaparse";
import ExcelJS from "exceljs";
import { useContext } from "react";
import { AuthContext } from "@/views/auth/AuthContext";
// import { UserDetail } from "@/views/home/Home";

interface DataTableExportActionProps<TData> {
  table: Table<TData>
}

function DataTableExportAction<TData>({
  table,
}: DataTableExportActionProps<TData>
) {
  const { user } = useContext(AuthContext);
  const handleExport = async () => {
    // Implement your export logic here
    // You can use table.getFilteredSelectedRowModel() to get the selected rows
    // and perform the necessary operations to export the data
    // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table;

    const tableData = table.getFilteredRowModel().rows.map((row) => row.original);
    console.log(tableData)
    console.log("USER:", user);

    // const csv = Papa.unparse(tableData);
    // const blob = new Blob([csv], { type: 'text/csv' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'data.csv';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // define columns
    worksheet.columns = [
      { header: 'Description', key: 'description', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Categories', key: 'categories', width: 20 },
      { header: 'Priority', key: 'priority', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Schedule', key: 'schedule', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'Image URLs', key: 'imageUrls', width: 20 },
      { header: 'User ID', key: 'userId', width: 20 },
    ];

    // add data rows
    tableData.forEach((row: any) => {
      if (row.schedule) {
        const timeInMillis = parseInt(row.schedule) * 1000;

        let dateFormat = new Date(timeInMillis).toLocaleDateString('id-ID', {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
        row.schedule = dateFormat
      }
      if (row.userId) {
        row.userId = user?.email ?? row.userId
        // TODO
        // const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
        // const [users, setUsers] = useState<UserDetail[]>([]);
        // const existingUser = userByName.find((user: any) => user.email === row.userId);
        // if (!existingUser) {
        //   // TODO: implement get user detail by admin auth
        // } else {  
        //   existingUser.count++;
        // }
      }
      worksheet.addRow(row);
    });

    // write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    //create a blob
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.xlsx';
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