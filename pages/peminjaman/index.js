import PGrid from './pinjam/pgrid';
import PForm from './pinjam/pform';
import React from 'react';

export default function Pinjam(){
    const [formmode, setMode] = React.useState(false);
    const [fdata, setForm] = React.useState({})
     const changeMode = () => {
        setMode(!formmode);
    }
    const setInitial = (id, name, rfid) => {
        setForm({
            userid: id,
            username: name,
            rfid: rfid
        })
    }
    if (formmode){
        return(<PForm fdata={fdata}></PForm>)
    }
    return (<PGrid setForm={setInitial} changeMode={changeMode}></PGrid>)
}