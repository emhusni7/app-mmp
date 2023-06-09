import { useMemo, useReducer } from "react";
import * as React from "react";
import dayjs from 'dayjs';
import IGrid from "./itemgrid";
import IForm from "./itemform";

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

export default function User(props){
    const [state, dispatch] = useReducer(reducer, initialState);
    // browse Category
    const browseCtg = async () => {
        const res = await fetch("/api/category?browse=1", {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        const result = await res.json()
        const dtres = result.map((x) => { return {value: x.id, title: x.category_name}})
        return dtres
    }

    // create
    const create = async (values) => {
        props.createProgress(true);
        const res = await fetch('/api/item',{
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
        }
        return res
    }
    // unlink
    const unlink = async (id, index) => {
        props.createProgress(true);
        const res = await fetch(`/api/item?id=${id}&delete=1`,{
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
        const res = await fetch('/api/item',{
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


    const browse = async () => {
        const res = await fetch("/api/item?browse=1", {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        const result = await res.json()
        const dtres = result.map((x) => { return {...x, createdat: dayjs(x.createdat).format("DD-MM-YYYY"), categories: x.categories.category_name}})
        dispatch({type: 'ITEMS_REQUESTED', items: dtres})
    }

    useMemo(() => browse(), [state.mode]);
    if (state.mode === 'view'){
        return (<IGrid 
            rows={state.items} 
            unlink={unlink}
            changeMode={(val) => dispatch({'type': 'CHANGE_MODE', mode: val})} 
            onEdit={(dt) => dispatch({'type': 'ITEMS_EDIT', data: dt}) }
        />)
    } else if (state.mode === 'edit'){
        return (<IForm 
            mode={state.mode}
            data={state.data}
            getList={browseCtg}
            write={write}
            onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
    } 
    return (<IForm mode={state.mode}
        create={create}
        getList={browseCtg} 
        onClose={() => dispatch({'type': 'CHANGE_MODE', mode: 'view'})} />)
}
