import { unstable_debounce as debounce } from '@mui/utils';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
const server = process.env.NEXT_PUBLIC_URL
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import BackspaceTwoToneIcon from '@mui/icons-material/BackspaceTwoTone';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
const DATASET_OPTION = {
  dataSet: 'Employee',
  rowLength: 10000,
};



const emptyObject = {};

const columns = [
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

export default function LazyLoadingGrid(props) {
  // dataServerSide simulates your database.
  


  const [initialRows, setInitialRows] = React.useState(props.items);
  const [rowCount, setRowCount] = React.useState(0);

  const fetchRow = 1;
  //   const fetchRow = React.useCallback(
//     async (params) => {
//       const serverRows = await loadServerRows(
//         rowsServerSide,
//         {
//           filterModel: params.filterModel,
//           sortModel: params.sortModel,
//         },
//         {
//           minDelay: 300,
//           maxDelay: 800,
//           useCursorPagination: false,
//         },
//         columnsWithDefaultColDef,
//       );

//       return {
//         slice: serverRows.returnedRows.slice(
//           params.firstRowToRender,
//           params.lastRowToRender,
//         ),
//         total: serverRows.returnedRows.length,
//       };
//     },
//     [rowsServerSide],
//   );

  // The initial fetch request of the viewport.
//   React.useEffect(() => {
//     if (rowsServerSide.length === 0) {
//       return;
//     }

//     (async () => {
//       const { slice, total } = await fetchRow({
//         firstRowToRender: 0,
//         lastRowToRender: 10,
//         sortModel: [],
//         filterModel: {
//           items: [],
//         },
//       });

//       setInitialRows(slice);
//       setRowCount(total);
//     })();
//   }, [rowsServerSide, fetchRow]);

  // Fetch rows as they become visible in the viewport
  const handleFetchRows = React.useCallback(
    async (params) => {
      const { slice, total } = await fetchRow(params);

      setRowCount(total);
    },
    [fetchRow],
  );

  //handleFetchRows
  const debouncedHandleFetchRows = React.useMemo(
    () => debounce(console.log("handleFetchRowsTes"), 200),
    [handleFetchRows],
  );

 // handleFetchRows

  return (
    <Box sx={{ height: 108 + (35 * 20) + 'px'} }>
      <DataGrid
        rows={initialRows}
        columns={columns}
        hideFooterPagination
        rowHeight={35}
        rowCount={rowCount}
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        
        onFetchRows={debouncedHandleFetchRows}
        experimentalFeatures={{
          lazyLoading: true,
        }}
      /> </Box>)
      }

export async function getServerSideProps(context) {
    const res = await fetch(`${server}/api/peminjaman`, {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            browse: 1,
            orderBy : {
                tgl_pinjam: 'desc'
            }}) 
    })
    const result = await res.json();
    const dtres = result.data.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), tgl_pinjam: x.tgl_pinjam, items: x.items.item_name}})
    return {
        props: {
            items: dtres
        }
    }
}