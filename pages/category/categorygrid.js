import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'categoryName',
    headerName: 'Category Name',
    width: 150,
    editable: true,
  },
  {
    //field: 'action',
    headerName: 'Action',
    width: 350,
    editable: true,
  },
];

const rows = [
  { id: 1, categoryName: 'Category A',},
  { id: 2, categoryName: 'Category B',},
];

export default function CGrid() {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}