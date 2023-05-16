import UGrid from "./usergrid";
import UForm from "./userform";

import * as React from "react";

export default function User(){
    const [formmode, setMode] = React.useState(false);
    const changeMode = () => {
        setMode(!formmode);
    }
    if (formmode === false){
        return (<UGrid changeMode={changeMode} />)
    }
    return (<UForm onClose={changeMode} />)
}