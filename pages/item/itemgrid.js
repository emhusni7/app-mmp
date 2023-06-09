import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';




export default function UGrid(props) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'item_name',
      headerName: 'Item Name',
      width: 200,
      editable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      editable: false,
    },
    {
      field: 'categories',
      headerName: 'Category',
      width: 100,
      editable: false
    },
    { field: 'actions', headerName: 'Actions', headerAlign: "center", align: 'center' , width: 400, renderCell: (index) => {
      return (
        <Grid container justifyContent={'center'}>
          <Grid item >
            <IconButton onClick={async () => {
              console.log(index);
              props.onEdit(index.row);
            }}>
               <Edit  />
            </IconButton>
            <IconButton sx={{pl:1}} onClick={async(e) => {
               if(confirm("Yakin Hapus User ?") === true){
                await props.unlink(index.row.id, index.api.getSortedRowIds().indexOf(index.row.id));
               }
            }}>
             <DeleteIcon />
            </IconButton>
            </Grid>
        </Grid>
            );
    } },
  ];
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Button variant="contained" onClick={() => props.changeMode('create')} sx={{ mb: 2}}>Create</Button>
      <DataGrid
        rows={props.rows}
        columns={columns}
        pageSize={5}
        rowLength={25}
        sx={{
          overflow: 'auto',
          '.MuiDataGrid-virtualScroller': {
            height: 'auto',
            overflow: 'hidden',
          },
          '.MuiDataGrid-main > div:nth-child(2)': {
            overflowY: 'auto !important',
            flex: 'unset !important',
          },
        }}
        autoHeight={true}
        rowsPerPageOptions={[25]}
        disableSelectionOnClick
        disableRowSelectionOnClick
        getRowId= {(row) => row.id}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}