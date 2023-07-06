import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import { Toolbar } from "@mui/material";
import Typography from '@mui/material/Typography';

import dayjs from 'dayjs';

function CustomizedInputBase(props){

    return (
    <Paper
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', mb:'10px' }}
      > 
       <IconButton sx={{ p: '10px' }} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search RFID"
            inputProps={{ 'aria-label': 'search rfid' }}
            value={props.value}
            onChange={props.onChange}
            onKeyDown={props.onEnter}
            //onKeyDown={props.onEnter}
            // onKeyDown={onEnter}
        />
        <IconButton onClick={props.onEnter} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton  color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
        </IconButton>
      </Paper>)
}


export default function PGrid(props) {

  const columns = [
    
    { field: 'userid', headerName: 'ID', width: 90 },
    {
      field: 'username',
      headerName: 'User Name',
      width: 180,
      sortable: false,
    },
    {
      field: 'items',
      headerName: 'Item Name',
      width: 150,
      sortable: false,
    },
    {
      field: 'description',
      headerName: 'Desc',
      sortable: false,
      width: 210,
    },
    {
      field: 'tgl_pinjam',
      headerName: 'Pinjam',
      sortable: false,
      width: 160,
      renderCell: (index) =>{
        return (dayjs(index.row.tgl_pinjam).format("DD-MM-YYYY HH:mm"))
      }
    },
    {
      field: 'tgl_kembali',
      headerName: 'Kembali',
      sortable: false,
      width: 160,
      renderCell: (index) =>{
        if (index.row.tgl_kembali){
          return (dayjs(index.row.tgl_kembali).format("DD-MM-YYYY HH:mm"))
      } else {
        return ""
      }
      }
    },
    {
      field: 'state',
      headerName: 'Status',
      sortable: false,
      width: 90,
      renderCell: (index) =>{
        return (<Chip label={index.row.state} color={index.row.state === 'Pinjam'? "primary": index.row.state === "Done"? "success": "error"} variant="outlined" />)
      }
      
    },
    // {field: 'id', headerName: 'Actions', headerAlign: "center", align: 'center' , width: 100, renderCell: (index) => {
    //   return (
    //     <Grid key={index.row.id} container justifyContent={'center'}>
    //       <Grid item >
    //         <IconButton sx={{pl:1}} onClick={async(e) => {
    //            if(confirm("Yakin Hapus User ?") === true){
    //             await props.unlink(index.row.id, index.api.getSortedRowIds().indexOf(index.row.id));
    //            }
    //         }}>
    //          <DeleteIcon />
    //         </IconButton>
    //         </Grid>
    //     </Grid>
    //         );
    // } }
  ];


  function ToolbarFunc(){
    return (<Box sx={{ flexGrow: 1 }}>
      <Toolbar variant="dense" disableGutters>
        <Grid container>
          <Grid item sx={{ml: 2}}>
            <Typography variant="h5" sx={{ fontWeight: 'bold'}} color='primary' component="h3">
              Kembali
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </Box>)
  }
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
            <CustomizedInputBase   value={props.value} onChange={(e) => props.onChange(e)} onEnter={props.onEnter} />
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '90%',
                
                }}
            >
              {/* <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>PINJAM</Box> */}
        
            <Box sx={{ height: 108 + (50 * 21) + 'px'} }>
            
            <DataGrid
                slots={{
                  toolbar: ToolbarFunc
                }}
                loading={props.loading}
                
                autoHeight={true}
                disableSelectionOnClick
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={50}
                rowsCount={props.rowLength}
                rows={props.rows}
                columns={columns}
                pageSizeOptions={[20]}
                paginationMode="server"
                paginationModel={props.paginationModel}
                onPaginationModelChange={props.setPaginationModel}
                experimentalFeatures={{ newEditingApi: true }}
                />
            </Box>
        </Paper>
        </Grid>
    </Grid>
  );
}