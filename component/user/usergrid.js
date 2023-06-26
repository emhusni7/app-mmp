import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { Toolbar } from "@mui/material";

function ToolbarFunc(){
  return (<Box sx={{ flexGrow: 1 }}>
    <Toolbar variant="dense" disableGutters>
      <Grid container>
        <Grid item sx={{ml: 2}}>
          <Typography variant="h5" sx={{ fontWeight: 'bold'}} color='primary' component="h3">
            User
          </Typography>
        </Grid>
      </Grid>
    </Toolbar>
  </Box>)
}

export default function UGrid(props) {
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'username',
      headerName: 'User Name',
      width: 600
    },
    {
      field: 'createdat',
      headerName: 'Created AT',
      width: 100
    },
    { field: 'actions', headerName: 'Actions', headerAlign: "center", align: 'center' , width: 400, renderCell: (index) => {
      return (
        <Grid container justifyContent={'center'}>
          <Grid item >
            <IconButton onClick={async () => {
              // console.log(index);
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
    <Box sx={{ maxHeight: 'calc(700vh - 360px)' }}>
      <Button variant="contained" onClick={() => props.changeMode('create')} sx={{ mb: 2}}>Create</Button>
      <DataGrid
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
        slots={{
          loadingOverlay: LinearProgress,
          toolbar: ToolbarFunc,
        }}
        loading={props.loading}
        disableRowSelectionOnClick
        getRowId= {(row) => row.id}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}

