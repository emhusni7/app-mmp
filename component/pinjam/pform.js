import { Grid, TextField, Box, Divider, Button, Paper, Stack, Chip,  Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { LocalizationProvider, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik } from 'formik';
import * as yup from "yup";
import Autosync from "../../src/components/Fields/autoComplete";

const ColorChips = (props) => {
    return (
      <Stack alignItems="right">
        <Stack direction="row" spacing={1}>
          <Chip label={props.state} color="primary" />
        </Stack>
        </Stack>
    );
  }

export const FHeader = (props) => {
    return (<>
   
    <Grid item xs={6}>
        <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>PINJAM</Box>
    </Grid>
    <Grid item xs={6} sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          bgcolor: 'background.paper',
         }}>
        <ColorChips state={props.state} />
    </Grid>
    <Grid item xs={12}>
        <Divider />
    </Grid></>)
}

export default function FPinjam(props){

    const mode = props.mode;
    // console.log(mode.includes('create','edit'));
    let initial_val;
    if (mode === 'create'){
        initial_val = { ...props.data}    
        console.log(initial_val);
    } else if (mode === 'edit'){
        initial_val = {
            id: props.data.id,
            userid: props.data.userid,
            rfid: props.data.rfid,
            username: props.data.username,
            items: {title: props.data.items, value: props.data.item_id},
            description: props.data.description,
            tgl_pinjam: props.data.tgl_pinjam,
            state: props.data.state,
            qty: props.data.qty,
            stUniq: 1
        }
    }
    
    
    const BCSchema = yup.object({
        userid: yup.number(),
        rfid: yup.string().required("RFID is Required"),
        username: yup.string(),
        items: yup.object().required("Item is Required"),
        description: yup.string().required("Desc is Required"),
        //tgl_pinjam: yup.date().required("Date Is Required"),
        // date_to: yup.string().required("Date To Is Required"),
        state: yup.string().required("State Is Required"),
        qty: yup.number().required("Qty Is Required")
    })
    
    return (<Formik
             initialValues={initial_val}
             validationSchema={BCSchema}
             onSubmit={(values, { 
                setSubmitting, resetForm
               }) => {
                setTimeout(async () => {
                    if (mode === 'create'){
                        const newValue = {...values, stUniq: 1, items: {connect : {id: values.items.value} }}
                        await props.create(newValue);
                        
                    } else if (mode === 'edit'){
                        const newValue = {...values, items: {connect : {id: values.items.value} }}
                        //alert(JSON.stringify(newValue));
                        await props.write(values.id, newValue);
                    }
                },1000);
            }}>
             {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldError,
                setFieldValue,
                isSubmitting
                }) => (<form onSubmit={handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                
                }}
            >
                    <Grid container spacing={2}>
                        <FHeader state={!values.id? "Pinjam" : ""} />
                        <Grid item xs={6}>
                            <TextField variant="standard" value={values.userid}  onChange={handleChange} size="small" name="userid" id="userid" fullWidth placeholder="User ID" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField variant="standard" value={values.rfid} inputProps={{ readOnly: true }} onChange={handleChange} size="small" name="rfid" id="rfid" fullWidth placeholder="RFID" required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="standard" onChange={handleChange} value={values.username} size="small" name="username" fullWidth  id="username" placeholder="Username" />
                        </Grid>
                        <Grid item xs={6}>
                        <Autosync 
                            id="items" 
                            label="Item ID" 
                            name="items"
                            value={values.items}
                            error={true}
                            onChange={(value) => {
                                if (!!value){
                                    setFieldValue("items", value)
                                    setFieldValue("description", value.description)
                                } else {
                                    setFieldValue("items", "")
                                    setFieldValue("description", "")
                                }
                            }} 
                            getListData={props.getList} 
                            multiple={false}>
                        </Autosync>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField error={true} type="number" variant="standard" onChange={handleChange} value={values.qty} size="small" name="qty" fullWidth  id="qty" placeholder="Qty" required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField  onChange={handleChange} multiline={true} rows={3} size="small" value={values.description} name="description" fullWidth  id="description" placeholder="Description" />
                        </Grid>
                        <Grid item xs={6}>
                            <DesktopDateTimePicker
                                    id="tgl_pinjam"
                                    variant="standard"
                                    name="tgl_pinjam"
                                    label="Date From"
                                    ampm={false}
                                    inputFormat="DD/MM/YYYY HH:mm"
                                    required
                                    fullWidth
                                    value={values.tgl_pinjam}
                                    onChange={(val) => {
                                        setFieldValue("tgl_pinjam", val, "")
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                        size="small"
                                        id="tgl_pinjam"
                                        name="tgl_pinjam"
                                        style={{ width: '100%'}}
                                        />}
                                    />
                        </Grid>
                        <Grid item xs={6}>
                        {/* {mode.includes('create','edit') ? "": (<DesktopDateTimePicker
                                    id="date_to"
                                    variant="standard"
                                    name="date_to"
                                    label="Date To"
                                    inputFormat="DD/MM/YYYY"
                                    required
                                    fullWidth
                                    value={values.date_to}
                                    onChange={(val) => {
                                        setFieldValue("date_to", val, "")
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                        size="small"
                                        id="date_to"
                                        name="date_to"
                                        style={{ width: '100%'}}
                                        />}
                                    />)} */}
                        
                        </Grid>
                        <Grid item xs={12}>
                        <Divider />
                            <br></br>
                            <Button  variant="contained" type="submit">Simpan</Button>
                            <Button sx={{pl:4}} onClick={props.onClose} color="error">
                                    Cancel
                            </Button> 
                        </Grid>
                    </Grid>
                    </Paper>
                    </Grid>
                    </Grid>
        </LocalizationProvider></form>)

             }
             </Formik>
   
        )
}