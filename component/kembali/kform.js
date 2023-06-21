
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
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import { Toolbar } from "@mui/material";
import { LocalizationProvider, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import { useState, useCallback, useMemo } from 'react';
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


function QuickSearchToolbar(props) {
  // const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar variant="dense" disableGutters>
        <Grid container>
          <Grid item sx={{ml: 2}}>
            <Typography variant="h5" sx={{ fontWeight: 'bold'}} color='primary' component="h3">
              History
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Grid sx={{ mr: 2}}  item xs={12}>
            <TextField 
              variant="standard"
              value={props.value}
              fullWidth
              onChange={props.onChange}
              
              placeholder="Search…"
              // className={classes.textField}
              InputProps={{
                
                endAdornment: (<>
                
                  <IconButton
                    title="Clear"
                    aria-label="Clear"
                    size="small"
                    style={{ visibility: props.value ? 'visible' : 'hidden' }}
                    onClick={props.clearSearch}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                  <SearchIcon fontSize="small" />
                  </>
                ),
              }}
            />
            </Grid>  
          </Grid>
      </Toolbar>
    </Box>
  );
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

  const { user} = useAppContext();
  const [form, setForm] = useState({
    date_f: null,
    date_t: null,
    state: [],
  })

  const getStr = () => {
    var obj = {
      browse: 1,
      where: {
        items: {
          categories: {
            id: {in: user.categories.map((x) => x.categoryid)}
          }
        }
    },
      
    }
    
    if(!!form.date_f) {
      obj.where.tgl_pinjam = {
        gte: form.date_f
      } 
    }

    if (!!form.date_t) {
      obj.where.tgl_pinjam = {
        gte: form.date_f,
        lte: form.date_t
      }
    }

    if(form.state.length > 0){
      obj.where.state = {in: form.state}
    }
    console.log(obj);
    return obj
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const onFilterChange = useCallback((filterModel) => {
    // Here you save the data you need from the filter model
    console.log(filterModel);
  }, []);


  const onKeyDown = useCallback(() => {
    let str = getStr();
     props.searchVal(JSON.stringify(str));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[form.date_f, form.date_t, form.state, onClear])

  const onClear = (e) => {
    setForm({date_f: null, date_t: null, state: []});
  }

  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
            
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '90%',
                }}
            >
            <Box sx={{ height: 108 + (35 * 20) + 'px'} }>
              <Grid container> 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={3}>
                    <DesktopDateTimePicker
                          id="tgl_pinjam"
                          variant="outlined"
                          ampm={false}
                          name="tgl_pinjam"
                          label="Date From"
                          inputFormat="DD/MM/YYYY hh:mm"
                          required
                          fullWidth
                          value={form.date_f}
                          onChange={(val) => {
                            setForm({...form, date_f: val})
                          }}
                          renderInput={(params) =>
                              <TextField {...params}
                              size="small"
                              id="tgl_pinjam"
                              name="tgl_pinjam"
                              style={{ width: '100%'}}
                              />}/>
                  </Grid>
                  <Grid item sx={{ml: 2}} xs={3}>
                    <DesktopDateTimePicker
                          id="tgl_kembali"
                          variant="standard"
                          name="tgl_kembali"
                          label="Date To"
                          inputFormat="DD/MM/YYYY HH:mm"
                          required
                          ampm={false}
                          fullWidth
                          value={form.date_t}
                          onChange={(val) => {
                            setForm({...form, date_t: val})
                          }}
                          renderInput={(params) =>
                              <TextField {...params}
                              size="small"
                              id="tgl_kembali"
                              name="tgl_kembali"
                              style={{ width: '100%'}}
                              />}/>
                  </Grid>
                  <Grid item sx={{ml: 2}} xs={3}>
                      <Autocomplete
                        multiple={true}
                        id="state"
                        fullWidth
                        size="small"
                        defaultValue={form.state}
                        name="state"
                        getOptionLabel={(option) => option }
                        options={['Pinjam','Done','Lost']}
                        onChange={(e, value) => setForm({...form, state: value})}
                        renderInput={(params) => <TextField {...params}  label="State" />}
                    />
                </Grid>
                <Grid item sx={{ml: 2}} xs={1}>
                      <Button onClick={onKeyDown} variant="outlined">Search</Button>      
                  </Grid>
                  <Grid item sx={{ml: 2}} xs={1}>
                      <Button onClick={(e) => onClear(e)} color='error'>Clear</Button>      
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <br/>
              <DataGrid
                  slots={{
                    toolbar: QuickSearchToolbar
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
                  rowCount={props.rowLength}
                  rows={props.rows}
                  columns={columns}
                  pageSizeOptions={[20]}
                  // filterMode="server"
                  // onFilterModelChange={onFilterChange}
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