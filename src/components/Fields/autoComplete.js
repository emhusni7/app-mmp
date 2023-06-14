import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useRef} from "react";


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Autosync(props) {
  
  const {onChange, multiple , name, getListData, label = "name", id = "id", showName,defaultValue,disabled,required,value,noOption="No Option", error} = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [loadingApi, setLoadingApi] = React.useState(false)
  let timeOut = useRef(null);

  const getData = async() => {
    setLoadingApi(true);
    const data = await getListData();
    setLoadingApi(false);
    if (data.length > 0){
      setOptions([...data]);
    }
  }

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    getData();
  }, []);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
    else {
      if (timeOut.current !== null)
          clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => getData(), 200);
    }

  }, [open]);

  return (
    <Autocomplete
      id={name}
      name={name}
      multiple={multiple}
      value={value}
      fullWidth
      size="small"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => `${option.title}`}
      options={options}
      onChange={(e, value) => onChange(value)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          error={error}
          required={required}
          label={label}
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top

