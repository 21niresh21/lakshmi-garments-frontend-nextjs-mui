"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, Chip, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import { People } from "@mui/icons-material";
import { fetchSuppliers } from "@/app/api/supplier";

type Employee = {
  id: number;
  name: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
};

const MOCK_DATA: Employee[] = [
  { id: 1, name: "Ramesh", role: "Cutter", status: "ACTIVE" },
  { id: 2, name: "Suresh", role: "Stitcher", status: "INACTIVE" },
  { id: 3, name: "Mahesh", role: "Packer", status: "ACTIVE" },
];

export default function Page() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchSuppliers()
      .then((res) => {
        setRows(res);
      })
      .catch((err) => {
        console.log("error fetching suppliers");
      });
  }, []);

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Employee>
          title="Suppliers"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          columns={[
            {
              id: "id",
              label: "ID",
              sortable: true,
            },
            {
              id: "name",
              label: "Supplier Name",
              sortable: true,
            },
            {
              id: "location",
              label: "Location",
              sortable: true,
              // render: (row) => (
              //   <Chip
              //     size="small"
              //     label={row.status}
              //     color={row.status === "ACTIVE" ? "success" : "default"}
              //   />
              // ),
            },
          ]}
          rowActions={[
            {
              label: "View",
              icon: <VisibilityIcon fontSize="small" />,
              onClick: (row) => console.log("View", row),
            },
            {
              label: "Edit",
              icon: <EditIcon fontSize="small" />,
              onClick: (row) => console.log("Edit", row),
            },
          ]}
          // toolbarExtras={
          //   <Button
          //     variant="contained"
          //     startIcon={<People />}
          //     onClick={() => openCreateDialog()}
          //   >
          //     Add Employee
          //   </Button>
          // }
        />
      </Grid>
    </Grid>
  );
}
