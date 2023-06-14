import PGrid from './pgrid';
import PForm from './pform';
import React, { useReducer, useMemo } from 'react';
import dayjs from 'dayjs';
const initialState = {
    mode: 'view',
    items: [],
    rowLength: undefined,
    paginationModel: {page: 0, pageSize: 25},
    
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
      default:
        return state;
    }
  } 

export default function Pinjam(props){
    const [state, dispatch] = useReducer(reducer, initialState)

    // Browse Item
    const browseItem = async () => {
        const res = await fetch("/api/item?browse=1", {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        const result = await res.json()
        const dtres = result.map((x) => { return {value: x.id, title: x.item_name, description: x.description}})
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
    const write = async (id, values) => {
        props.createProgress(true);
        const res = await fetch('/api/peminjaman',{
            headers: {
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


    const browse = async (page, limit) => {
        const skip = page * limit;
        const res = await fetch("/api/peminjaman", {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                browse: 1,
                where: {
                    tgl_kembali: undefined,
                    stUniq: 1
                },
                skip: skip,
                take: limit,
                orderBy : {
                    tgl_pinjam: 'desc'
                }
            })
        })
        const result = await res.json()
        const dtres = result.data.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), tgl_pinjam: x.tgl_pinjam, items: x.items.item_name}})
        dispatch({type: 'ITEMS_REQUESTED', items: dtres, rowLength: result.pagination.total})
    }
    useMemo(() => {
        if (state.mode === 'view'){
            browse(state.paginationModel.page, state.paginationModel.pageSize);
        }
    } , [state.mode, state.paginationModel.page]);

    if (state.mode === 'view'){
        return (<PGrid 
            rows={state.items} 
            unlink={unlink}
            setForm={(id, name, rfid) => dispatch({'type':'SET_FORM', id, name, rfid})}
            changeMode={(val) => dispatch({'type': 'CHANGE_MODE', mode: val})} 
            onEdit={(dt) => dispatch({'type': 'ITEMS_EDIT', data: dt})}
            paginationModel={state.paginationModel}
            rowCount={state.rowLength}
            createNotif={props.createNotif}
            createProgress={props.createProgress}
            setPaginationModel={(env) => dispatch({type: 'SET_PAGINATION', page: env.page})}
        />)
    } else if (state.mode === 'edit'){
        return (<PForm 
            mode={state.mode}
            data={state.data}
            getList={browseItem}
            write={write}
            onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
    } 
    //dispatch({'type': 'SET_FORM', id, name, rfid}
    return (<PForm 
        mode={state.mode}
        create={create}
        data={state.data}
        getList={browseItem} 
        onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
}