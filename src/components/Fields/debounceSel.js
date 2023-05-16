import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';

export default function DebSync(props) {
    const { getAsyncData, name, noOptionsText, label, required, onInputChange  } = props;
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    

    const fetch = (request) => React.useMemo(() => getAsyncData(request));
  
    React.useEffect(() => {
      let active = true;
  
      if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
      }
  
      fetch({ input: inputValue }, (results) => {
        if (active) {
          let newOptions = [];
  
          if (value) {
            newOptions = [value];
          }
  
          if (results) {
            newOptions = [...newOptions, ...results];
          }
  
          setOptions(newOptions);
        }
      });
  
      return () => {
        active = false;
      };
    }, [value, inputValue]);
  
    return (
      <Autocomplete
        id={name}
        name={name}
        sx={{ width: 300 }}
        getOptionLabel={(option) => `${option.kode} - ${option.name}`}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText={noOptionsText}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          debounce(() => { setInputValue(newInputValue) }, 1300)
        }}
        renderInput={(params) => (
          <TextField 
            {...params}
            variant='standard'
            required={required}        
            label={label} 
            fullWidth />
        )}
      />
    );
  }