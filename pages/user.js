import dayjs from 'dayjs';
import * as React from "react";
import {UForm, UGrid} from "../component/user";
import { useEffect, useReducer, useCallback  } from "react";
const server = process.env.NEXT_PUBLIC_URL

const initialState = {
    mode: 'view',
    loading: false,
    items: []
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'ITEMS_REQUESTED':
        return {...state, items:action.items}
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
      default:
        return state;
    }
  } 

export default function User(props){

    const [state, dispatch] = useReducer(reducer, initialState)
    // browse Category
    const browseCtg = async () => {
        const res = await fetch(`${server}/api/category?browse=1`)
        const result = await res.json()
        const dtres = result.map((x) => { return {value: x.id, title: `${x.category_name} - ${x.company}`}})
        return dtres
    }

    const browseItem = useCallback((val) => async() => {
        let dtres = []
        if (val !== undefined){
            const categs = val.map(x => x.value)
            const res = await fetch(`${server}/api/item?search=${categs}`)
            const result = await res.json()
            dtres = result.map((x) => { return {value: x.id, title: `${x.item_name} ${x.description}`}})
        }
        return dtres
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[browseCtg])

    // create
    const create = async (values) => {
        
        props.createProgress(true);
        
        const res = await fetch('/api/user',{
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
        }
        return res
    }
    // unlink
    const unlink = async (id, index) => {
        props.createProgress(true);
        const res = await fetch(`${server}/api/user?id=${id}&delete=1`)
        props.createProgress(false);
        if (res.status === 200){
            dispatch({...state, type: 'ITEMS_DELETED', idx: index})
            props.createNotif('success', 'Data Has Been Delete')
        } else {
            const err = await res.json();
            props.createNotif("error", err.message);
        }
        return res
    }
    // update
    const write = async (id, values) => {
        props.createProgress(true);
        const res = await fetch('/api/user',{
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
            const err = await res.json();
            props.createNotif("error", err.message);
        }
        return res
    }

    

    const getUser = async () => {
        dispatch({type: 'SET_LOADING', loading: true})
        const res = await fetch(`${server}/api/user?browse=1`)
        const result = await res.json()
        const dtres = result.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), items: {title: x.items?.description, value: x.item_id},  item_id: undefined}})
        dispatch({type: 'SET_LOADING', loading: false})
        dispatch({type: 'ITEMS_REQUESTED', items: dtres})
    }

    useEffect(() =>{
        if (state.mode !== 'edit'){
            getUser();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [state.mode]);

    if (state.mode === "view"){
        return (<UGrid 
                    rows={state.items} 
                    unlink={unlink}
                    changeMode={(val) => dispatch({'type': 'CHANGE_MODE', mode: val})} 
                    onEdit={(dt) => dispatch({'type': 'ITEMS_EDIT', data: dt}) }
                    loading={state.loading}
                />
                )
    } else if (state.mode === "edit") {
        return (<UForm 
                    mode={state.mode}
                    data={state.data}
                    write={write}
                    getList={browseCtg}
                    getItem={browseItem}
                    onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})}
        />)
    }

    return (<UForm 
                mode={state.mode}
                create={create} 
                getList={browseCtg}
                getItem={browseItem}
                onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})}
            />)
    //return <div>1</div> 
}