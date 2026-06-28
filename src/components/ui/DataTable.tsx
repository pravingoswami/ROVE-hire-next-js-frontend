"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export type DataColumn<T> = {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
};

const cellPad = { px: 2.5, py: 1.5 };

export function DataTable<T>({ columns, rows, getRowId }: DataTableProps<T>) {
  return (
    <TableContainer component={Box} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={col.id}
                align={col.align ?? "left"}
                sx={{
                  ...cellPad,
                  ...(i === 0 && { pl: 2.5 }),
                  ...(i === columns.length - 1 && { pr: 2.5 }),
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)} hover>
              {columns.map((col, i) => (
                <TableCell
                  key={col.id}
                  align={col.align ?? "left"}
                  sx={{
                    ...cellPad,
                    ...(i === 0 && { pl: 2.5 }),
                    ...(i === columns.length - 1 && { pr: 2.5 }),
                  }}
                >
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
