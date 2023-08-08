import React, { useReducer, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {PGrid, PForm} from '../component/point_kembali';
const server = process.env.NEXT_PUBLIC_URL
import { useAppContext } from '../src/models/withAuthorization';

const initialState = {
    mode: true,
    items: [],
    rowLength: undefined,
    rfid: '',
    paginationModel: {page: 0, pageSize: 20},
    loading: false
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'ITEMS_REQUESTED':
        return {...state, items:action.items, rowLength: action.rowLength}
      case 'ITEMS_ADD':
        const data = [...state.items];
        data.unshift(action.item);
        return {...state, items: data}
      case 'ITEMS_DELETED':
        const arr = [...action.items]
        if (action.idx !== -1) {
            arr.splice(action.idx,1)
        }
        return {...state, items: arr}
      case 'ITEMS_EDIT':
        return {...state, mode: 'edit', data: action.data}
      case 'CHANGE_MODE':
        return {...state, mode: action.mode}
      case 'SET_LOADING':
        return {...state, loading: action.loading}
      case 'SET_RFID':
        return {...state, rfid: action.rfid}
      case 'SET_PAGINATION':
        return {...state, paginationModel: {...state.paginationModel, page: action.page}}  
      default:
        return state;
    }
  } 

export default function Kembali(props){
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user } = useAppContext();
    // Browse Item
    const browseItem = async () => {
        const res = await fetch("/api/item?browse=1", {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        const result = await res.json()
        const dtres = result.map((x) => { return {value: x.id, title: `${x.item_name}  (${x.categories.company})`, description: x.description}})
        return dtres
    }

    // create
    const create = async (values) => {
        props.createProgress(true);
        const res = await fetch('/api/peminjaman',{
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(values)
        })
        
        props.createProgress(false);
        if (res.status === 200) {
            dispatch({'type': 'CHANGE_MODE', mode: 'view'})
            props.createNotif("success", "Data Has Been Saved")
        } else {
            const err = await res.json();
            props.createNotif("error", err.message);
            return err
        }
        return res
        
    }
    // unlink
    const unlink = async (id, index) => {
        props.createProgress(true);
        const res = await fetch(`/api/peminjaman?id=${id}&delete=1`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        props.createProgress(false);
        if (res.status === 200){
            dispatch({...state, type: 'ITEMS_DELETED', idx: index})
            props.createNotif('success', 'Data Has Been Delete')
        } else {
            props.createNotif('error', 'Error Deleted')
        }
        return res
    }
    // update
    const write = useCallback(async (id, index) => {
        
        const res = await fetch('/api/peminjaman',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                
            })
        })
        
        if (res.status === 200) {
            const temp  = [...state.items];
            const dt = temp[index];
            temp[index] = {...dt, tgl_kembali: new Date().toISOString(), state: 'Done'}
            dispatch({type: 'ITEMS_REQUESTED', items: temp})
            props.createNotif("success", "Data Has Been Saved")
        } else {
            props.createNotif("Error", "Error")
        }
        return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, state.items])
    
   

    useEffect(() => {
        async function fetchData(page, limit){
            const skip = page * limit;
            let jsonStr;
            if (user.categories.length > 0){
                jsonStr = {
                    browse: 1,
                    where: {
                        items: {
                            categories: {id: {in: user.categories.map((x) => x.categoryid)}}
                        }
                    },
                    skip: skip,
                    take: limit,
                    orderBy : {
                        tgl_kembali: 'desc'
                    }
                }
            } else {
                jsonStr = {
                    browse: 1,
                    skip: skip,
                    take: limit,
                    orderBy : {
                            tgl_kembali: 'desc'
                    }
                } 
            }
            dispatch({type: 'SET_LOADING', loading: true})
            const res = await fetch(`${server}/api/peminjaman`, {
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(jsonStr)
            })
            const result = await res.json()
            const dtres = result.data.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), tgl_pinjam: x.tgl_pinjam, items: x.items.item_name}})
            dispatch({type: 'ITEMS_REQUESTED', items: dtres, rowLength: result.pagination.total})
            dispatch({type: 'SET_LOADING', loading: false})
        }
        if (state.mode !== 'edit'){
            fetchData(state.paginationModel.page, state.paginationModel.pageSize);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.paginationModel.page, state.paginationModel.pageSize, state.mode])
    
    
    const changeRFID = (e) => {
      dispatch({type: 'SET_RFID', rfid: e.target.value})
    };

   
  
    const onKeyDown = useCallback (async (e) =>{
      if (e.key === 'Enter'){
        const res = await fetch("/api/point_pinjam",{
          method: 'PUT',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            rfid: state.rfid,
            tgl_kembali:new Date().toISOString(),
            state: 'Done',
            stUniq: null,
          })
        })
        
        if (res.status === 200) {
            const dt = await res.json();
            props.createNotif('success', 'Transaksi Pengembalian Berhasil')
            dispatch({type: 'CHANGE_MODE', mode: !state.mode})
          } else {
            const dt = await res.json();
            props.createNotif('error', dt.message)
        }
        
        dispatch({type: 'SET_RFID', rfid: ''});
      }
    },[ props, state.rfid, user.item_id])

    
    return (<PGrid 
        rows={state.items} 
        unlink={unlink}
        onChange={changeRFID}
        value={state.rfid}
        onEnter={onKeyDown}
        rowLength={state.rowLength}
        paginationModel={state.paginationModel}
        createNotif={props.createNotif}
        loading={state.loading}
        createProgress={props.createProgress}
        setPaginationModel={(env) => dispatch({type: 'SET_PAGINATION', page: env.page})}
    />)
}

export async function getServerSideProps(context){
    return {
        props: {
            // items: dtres
        }
    }
}