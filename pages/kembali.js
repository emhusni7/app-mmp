import React, { useReducer, useMemo } from 'react';
import {KGrid, KForm} from '../component/kembali';
import dayjs from 'dayjs';
const server = process.env.NEXT_PUBLIC_URL


const initialState = {
    mode: 'view',
    items: [],
    rowLength: undefined,
    paginationModel: {page: 0, pageSize: 25},
    searchVal: null,
    loading: false    
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'ITEMS_REQUESTED':
        return {...state, items:action.items, rowLength: action.rowLength}
      case 'ITEMS_DELETED':
        const arr = [...action.items]
        if (action.idx !== -1) {
            arr.splice(action.idx,1)
        }
        return {...state, items: arr}
      case 'ITEMS_EDIT':
        return {...state, mode: 'edit', data: action.data}
      case 'SET_FORM': 
        return {...state, data: {userid: action.id, username: action.name, rfid: action.rfid, qty: 1, state: 'Pinjam', tgl_pinjam: new Date()}}
      case 'CHANGE_MODE':
        return {...state, mode: action.mode}
      case 'SET_PAGINATION':
        return {...state, paginationModel: {...state.paginationModel, page: action.page}}
      case 'SET_SEARCH':
        return {...state, searchVal: action.searchVal}
      case 'SET_LOADING':
        return {...state, loading: action.loading}
      default:
        return state;
    }
  } 

export default function Kembali(props){
    const [state, dispatch] = useReducer(reducer, initialState)

    // Browse Item
    const browseItem = async () => {
        const res = await fetch(`${server}/api/item?browse=1`)
        const result = await res.json()
        const dtres = result.map((x) => { return {value: x.id, title: x.item_name, description: x.description}})
        return dtres
    }

    // create
    const create = async (values) => {
        props.createProgress(true);
        const res = await fetch('/api/peminjaman',{
            headers: {
                'Accept': 'application/json',
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
        const res = await fetch(`${server}/api/peminjaman?id=${id}&delete=1`)
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
    const write = async (id, values) => {
        props.createProgress(true);
        const res = await fetch('/api/peminjaman',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(values)
        })
        
        props.createProgress(false);
        if (res.status === 200) {
            dispatch({'type': 'CHANGE_MODE', mode: 'view'})
            props.createNotif("success", "Data Has Been Saved")
        } else {
            props.createNotif("Error", "Error")
        }
        return res
    }


    const browse = async () => {
        let jsonDt;
            dispatch({type: 'SET_LOADING', loading: true})
        if (!!state.searchVal){
          jsonDt = state.searchVal;       
        } else {
          jsonDt = JSON.stringify({
            browse: 1,
            orderBy : {
                tgl_pinjam: 'desc'
            }})  
        }
        const res = await fetch("/api/peminjaman", {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: jsonDt
        })
        const result = await res.json()
        const dtres = result.data.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), tgl_pinjam: x.tgl_pinjam, items: x.items.item_name}})
        dispatch({type: 'ITEMS_REQUESTED', items: dtres, rowLength: result.pagination.total})
        dispatch({type: 'SET_LOADING', loading: false})
    }

    // useMemo(() => {
    //     if (state.mode === 'view'){
    //         browse(state.paginationModel.page, state.paginationModel.pageSize);
    //     }
    // } , [ state.mode, state.paginationModel.page, state.paginationModel.pageSize]);

    if (state.mode === 'view'){
        return (<KGrid
            rows={state.items} 
            unlink={unlink}
            setForm={(id, name, rfid) => dispatch({'type':'SET_FORM', id, name, rfid})}
            changeMode={(val) => dispatch({'type': 'CHANGE_MODE', mode: val})} 
            onEdit={(dt) => dispatch({'type': 'ITEMS_EDIT', data: dt})}
            paginationModel={state.paginationModel}
            searchVal={(value) => dispatch({'type': 'SET_SEARCH', searchVal: value})}
            rowCount={state.rowLength}
            loading={state.loading}
            setPaginationModel={(env) => dispatch({type: 'SET_PAGINATION', page: env.page})}
        />)
    } else if (state.mode === 'edit'){
        return (<KForm 
            mode={state.mode}
            data={state.data}
            getList={browseItem}
            write={write}
            onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
    } 
    //dispatch({'type': 'SET_FORM', id, name, rfid}
    return (<KForm
        mode={state.mode}
        create={create}
        data={state.data}
        getList={browseItem} 
        onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
}

