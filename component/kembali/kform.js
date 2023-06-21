
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import BackspaceTwoToneIcon from '@mui/icons-material/BackspaceTwoTone';
import DirectionsIcon from '@mui/icons-material/Directions';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import {useState} from 'react';
import { useAppContext } from '../../src/models/withAuthorization';

function CustomizedInputBase(props){

  return (
    <Paper
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', mb:'10px' }}
      > 
       <IconButton sx={{ p: '10px' }} aria-label="menu">
          {/* <MenuIcon /> */}
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


export default function KGrid(props) {


  const columns = [
    // {field: 'id', hidden: true},
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
      renderCell: (index) =>{
        return (index.row.tgl_kembali !== null ? dayjs(index.row.tgl_kembali).format("DD-MM-YYYY HH:mm"): "")
      }
      
    },
    {
      field: 'state',
      headerName: 'Status',
      sortable: false,
      width: 160,
      renderCell: (index) =>{
        return (<Chip label={index.row.state} color={index.row.state === 'Pinjam'? "primary": index.row.state === "Done"? "success": "error"} variant="outlined" />)
      }
      
    },
    {field: 'id',headerName: 'Action', headerAlign: "center", align: 'center' , width: 70, renderCell: (index) => {
      return (
        <Grid container justifyContent={'center'}>
          <Grid item >
            {
              index.row.tgl_kembali === null ? ( <>
              <IconButton label="Done" name="Done" color="primary" onClick={() => props.onDone(index.row.id, index.api.getSortedRowIds().indexOf(index.row.id))}>
              <DoneAllTwoToneIcon /> 
            </IconButton>
            
            <IconButton label="Hilang" name="Hilang" color="error" onClick={() => props.unlink(index.row.id, index.api.getSortedRowIds().indexOf(index.row.id))}>
              <BackspaceTwoToneIcon /> 
            </IconButton>
            </>): ""
            }
           
            </Grid>
        </Grid>
            );
    } 
  },
 
  ];

  const [value, setValue] = useState("");
  const { user} = useAppContext();
  
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
        stUniq: 1,
        items: {
          categories: {
            id: {in: user.categories.map((x) => x.categoryid)}
          }
        }
    },
      skip: 0,
      take: 20,
    }
  }

  const onKeyDown = (e) => {
    
    if (e.key === "Enter"){
      if (!value){
        props.searchVal("");  
      } else {
        let str = getStr();
        props.searchVal(JSON.stringify(str));
        
      }
      
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
                slots={{
                  
                    toolbar: GridToolbar,
                }}
                loading={props.loading}
                sx={{
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
                rows={props.rows}
                columns={columns}
                pageSizeOptions={[20]}
                filterMode="server"
                onFilterModelChange={onFilterChange}
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