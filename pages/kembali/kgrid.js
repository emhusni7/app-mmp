import  {useMemo,  useState, useCallback} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid, Paper, InputBase, Divider, TextField } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
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
            placeholder="Search RFID / No. ID"
            inputProps={{ 'aria-label': 'search rfid' }}
            value={props.value}
            onChange={props.onChange}
            onKeyDown={props.onEnter}
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


export default function UGrid(props) {

  const columns = [
    {field: 'id', hide: true},
    { field: 'userid', headerName: 'User ID', width: 90 },
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
      
    },
    {field: 'id', headerName: 'Actions', headerAlign: "center", align: 'center' , width: 200, renderCell: (index) => {
      return (
        <Grid container justifyContent={'center'}>
          {/* <Grid item >
            <IconButton onClick={async () => {
              props.onEdit(index.row);
            }}>
               <Edit />
            </IconButton>
            <IconButton sx={{pl:1}} onClick={async(e) => {
               if(confirm("Yakin Hapus User ?") === true){
                await props.unlink(index.row.id, index.api.getSortedRowIds().indexOf(index.row.id));
               }
            }}>
             <DeleteIcon />
            </IconButton>
            </Grid> */}
        </Grid>
            );
    } }
  ];

  const [value, setValue] = useState("");
  
  const changeRFID = (e) => {
    setValue(e.target.value)
  };

  const getStr = () => {
    return {
      browse: 1,
      where: {
        OR: [
          {
            userid: {
              contains:value
            }
          },
          {
            rfid: {
              contains: value
            }
          }
      ],
        tgl_kembali: undefined,
        stUniq: 1
    },
      skip: 0,
      take: 20,
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter"){
      const str = getStr();
      props.searchVal(JSON.stringify(str));
    }
  }

  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
            <CustomizedInputBase value={value} onChange={(e) => changeRFID(e)} onEnter={(e) => onKeyDown(e)}  />
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '90%',
                }}
            >
            <Box sx={{ height: 108 + (35 * 20) + 'px'} }>
            <DataGrid
                // slots={{
                //   loadingOverlay: LinearProgress
                // }}
                loading={props.rows.length === 0 || props.loading}
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
                disableSelectionOnClick
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={35}
                rowCount={props.rowCount}
                rows={props.rows}
                columns={columns}
                pageSizeOptions={[25]}
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