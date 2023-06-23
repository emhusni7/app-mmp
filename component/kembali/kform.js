
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
import { useState, useCallback, useMemo, useEffect, useRef} from 'react';
import { useAppContext } from '../../src/models/withAuthorization';
import debounce from 'lodash.debounce';



function QuickSearchToolbar(props) {
  // const classes = useStyles();

    const DebounceWithUseMemo = () =>{

        const [val, setVal] = useState(props.searchText);
        const sendBackendReq = useCallback((value) => {
          props.handleChange(value);
        },[])

        
        const debouncedSendRequest = useMemo(() => {
          return debounce(sendBackendReq, 1000);
        }, [sendBackendReq]);

        

        const onChange = (e) => {
            const value = e.target.value;
            setVal(value);
            debouncedSendRequest(value);
        }

        return (<TextField 
                  variant="standard"
                  fullWidth
                  onChange={onChange}
                  placeholder="Search…"
                  value={val}
                  InputProps={{  
                    endAdornment: (<>
                      <IconButton
                        title="Clear"
                        aria-label="Clear"
                        size="small"
                        style={{ visibility: val ? 'visible' : 'hidden' }}
                        onClick={() => props.OnClearText()}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                      <SearchIcon fontSize="small" />
                      </>
                    ),
                  }}
                />)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  

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
                <DebounceWithUseMemo />
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
    searchText: "",
  })


  const getStr = (date_f, date_t, state, searchText) => {
    var obj = {
      browse: 1
    }
    
    if (user.categories.length > 0) {
      obj = {...obj, 
        where: {
          items: {
            categories: {
              id: {in: user.categories.map((x) => x.categoryid)}
            }
          }
        }
      }
    } else {
      obj: {
        where: {

        }
      }
    }

    if(!!date_f) {
      obj.where = {...obj.where,
        tgl_pinjam:{
          gte: date_f !== null ? date_f : undefined 
        } 
      }
    } 

    if (!!date_t) {
      obj.where.tgl_pinjam = {...obj.where.tgl_pinjam ,lte: date_t !== null ? date_t : undefined}
    }

    if(state.length > 0){
      obj.where = {...obj.where,
        state: {in: state}
      }
     }
    if (!!searchText){
      obj.where = {...obj.where,
        OR: [
          {userid: {contains: searchText}},
          {username: {contains: searchText}},
        ]
      }
    }

    return obj
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

const onFilterChange = (value) => {
  setForm({...form, searchText: value});
  setForm((prev) => {
      const str = getStr(prev.date_f, prev.date_t, prev.state, prev.searchText);  
      props.searchVal(JSON.stringify(str));
      return prev
    })
  return
}


 
 // eslint-disable-next-line react-hooks/exhaustive-deps
 const debSearch = useCallback(onFilterChange,[form,props])

 const onKeyDown = (e) => {
    const str = getStr(form.date_f, form.date_t, form.state, form.searchText);
    props.searchVal(JSON.stringify(str));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }
 
  
  // client usage, given some state dep
  const OnClear = useCallback(() => {
      setForm({ date_f: null, date_t: null, state: [], searchText: ""})
      setForm((prev) => {
        const str = getStr(prev.date_f, prev.date_t, prev.state, prev.searchText);
        props.searchVal(JSON.stringify(str));
        return prev
      })
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props])
  
  const OnClearSearch = useCallback(() => {
    setForm((prev) => {
      const str = getStr(prev.date_f, prev.date_t, prev.state, "");  
      props.searchVal(JSON.stringify(str));
      return {...prev, searchText: ""}
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[form.date_f, form.date_t, form.state, props]
)



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
                          inputFormat="DD/MM/YYYY HH:mm"
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
                        value={form.state}
                        name="state"
                        getOptionLabel={(option) => option }
                        options={['Pinjam','Done','Lost']}
                        onChange={(e, value) => setForm({...form, state: value})}
                        renderInput={(params) => <TextField {...params}  label="State" />}
                    />
                </Grid>
                <Grid item sx={{ml: 2}} xs={1}>
                      <Button onClick={(e) => onKeyDown(e)} variant="outlined">Search</Button>      
                  </Grid>
                  <Grid item sx={{ml: 2}} xs={1}>
                      <Button onClick={OnClear} color='error'>Clear</Button>      
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <br/>
              <DataGrid
                  slots={{
                    toolbar: QuickSearchToolbar
                    }
                  }
                  slotProps={{
                    toolbar: { handleChange: debSearch, OnClearText: OnClearSearch, searchText: form.searchText}
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