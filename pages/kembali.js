import React, { useReducer, useEffect, useCallback } from 'react';
import {KGrid, KForm} from '../component/kembali';
import dayjs from 'dayjs';
import { useAppContext } from '../src/models/withAuthorization';
const server = process.env.NEXT_PUBLIC_URL;


const initialState = {
    mode: 'view',
    items: [],
    rowLength: undefined,
    paginationModel: {page: 0, pageSize: 20},
    searchVal: null,
    loading: false    
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'ITEMS_REQUESTED':
        console.log(action.rowLength);
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
    const { user } = useAppContext();
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
    const unlink = useCallback(async (id, index) => {
        
        const res = await fetch('/api/peminjaman',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                tgl_kembali:new Date().toISOString(),
                state: 'Lost',
                stUniq: null,
            })
        })
        
        if (res.status === 200) {
            const temp  = [...state.items];
            const dt = temp[index];
            temp[index] = {...dt, tgl_kembali: new Date().toISOString(), state: 'Lost'}
            dispatch({type: 'ITEMS_REQUESTED', items: temp})
            props.createNotif("success", "Data Has Been Saved")
        } else {
            props.createNotif("Error", "Error")
        }
        return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, state.items])

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
                tgl_kembali:new Date().toISOString(),
                state: 'Done',
                stUniq: null,
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
        let jsonDt;
        
        const usrCateg = user.categories.map((x) => x.categoryid);
        
        async function fetchData(page, limit){
            dispatch({type: 'SET_LOADING', loading: true})
            const skip = page * limit;
            if (!!state.searchVal){
                const dtJson = JSON.parse(state.searchVal)
                dtJson.take = limit;
                dtJson.skip = skip;
                jsonDt = JSON.stringify(dtJson);
            } else {
                if (usrCateg.length > 0){
                    jsonDt = JSON.stringify({
                        where: {
                            items: {
                                categories: {id: {in: usrCateg}  
                                }
                            }
                        },
                        browse: 1,
                        include:{
                            items: {
                                categories: true
                            }
                        },
                        skip: skip,
                        take: limit,
                        orderBy : {
                            tgl_pinjam: 'desc'
                        }})
                } else {
                    jsonDt = JSON.stringify({
                        browse: 1,
                        include:{
                            items: {
                                categories: true
                            }
                        },
                        skip: skip,
                        take: limit,
                        orderBy : {
                            tgl_pinjam: 'desc'
                        }})
                }
                      
            }
            const res = await fetch(`${server}/api/peminjaman`, {
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
        fetchData(state.paginationModel.page, state.paginationModel.pageSize);
           
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [state.mode, state.paginationModel.page, state.paginationModel.pageSize, state.searchVal]);

   
        return (<KGrid
            rows={state.items} 
            unlink={unlink}
            setForm={(id, name, rfid) => dispatch({'type':'SET_FORM', id, name, rfid})}
            onDone={write}
            rowLength={state.rowLength}
            paginationModel={state.paginationModel}
            searchVal={(value) => dispatch({'type': 'SET_SEARCH', searchVal: value})}
            loading={state.loading}
            setPaginationModel={(env) => dispatch({type: 'SET_PAGINATION', page: env.page})} />)

}