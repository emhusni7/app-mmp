import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';

export default function CGrid(props) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90, type: '' },
    {
      field: 'category_name',
      headerName: 'Category Name',
      width: 400
     
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 100
     
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
    } }
  ];

  return (
    <Box sx={{ height: '550px', width: '100%' }}>
      <Button variant="contained" onClick={() => props.changeMode('create')} sx={{ mb: 2}}>Create</Button>
      <DataGrid
        slots={{
          loadingOverlay: LinearProgress
        }}
        loading={props.rows.length === 0}
        rows={props.rows}
        columns={columns}
        pageSize={5}
        rowHeight={35}
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