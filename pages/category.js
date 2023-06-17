import { useCallback, useReducer, useMemo } from "react";
import * as React from "react";
import dayjs from 'dayjs';
import {CGrid, CForm} from "../component/category";
const server = process.env.NEXT_PUBLIC_URL



const initialState = {
    mode: 'view',
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
      default:
        return state;
    }
  } 

export default function Category(props){
    const [state, dispatch] = useReducer(reducer, initialState)
    // create
    const create = async (values) => {
        props.createProgress(true);
        const res = await fetch('/api/category',{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
        const res = await fetch(`${server}/api/category?id=${id}&delete=1`)
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
        const res = await fetch('/api/category',{
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


    const browse = () =>{
        dispatch({type: 'ITEMS_REQUESTED', items: props.items})
    }

    useMemo(() => browse(), [props.items]);
    if (state.mode === 'view'){
        return (<CGrid 
            rows={state.items} 
            unlink={() => unlink}
            changeMode={(val) => dispatch({'type': 'CHANGE_MODE', mode: val})} 
            onEdit={(dt) => dispatch({'type': 'ITEMS_EDIT', data: dt}) }
        />)
    } else if (state.mode === 'edit'){
        return (<CForm 
            mode={state.mode}
            data={state.data}
            write={write}
            onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
    } 
    return (<CForm mode={state.mode}
        create={create} 
        onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
}

export async function getServerSideProps(context){
    const res = await fetch(`${server}/api/category?browse=1`)
    const result = await res.json()
    const dtres = result.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY")}})
    return {
        props: {
            items: dtres
        }
    }
}