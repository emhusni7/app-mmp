import { Grid, TextField, Box, Divider, Button, Paper } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as yup from "yup";

export default function FPinjam(props){
    const initial_val = { ...props}
    const BCSchema = yup.object({
        userid: yup.number().required("UserId is Required"),
        rfid: yup.string().required("RFID is Required"),
        username: yup.string().required("Username is Required"),
        item_id: yup.string().required("Item is Required"),
        description: yup.string().required("Desc is Required"),
        date_f: yup.string().required("Date Is Required"),
        date_to: yup.string().required("Date To Is Required"),
        state: yup.string().required("State Is Required"),
    })
    

    const formFmk = useFormik({
        initialValues: initial_val,
        validationSchema: BCSchema,
        onSubmit: (values, { 
          setSubmitting
         }) => {
            alert(JSON.stringify(values, null, 2));
            setTimeout(() => {
            setSubmitting(false);
           // NotificationManager.success('Data Has Been Saved', 'Saved');
          },1000);
        },
      });
    
    return (
    <form onSubmit={formFmk.handleSubmit}>
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
                <Grid item xs={12}>
                <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>BORROW</Box>
                    <Divider />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="standard" inputProps={{ readOnly: true }} onChange={formFmk.handleChange} size="small" name="userid" id="userid" fullWidth placeholder="User ID" required />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="standard" inputProps={{ readOnly: true }} onChange={formFmk.handleChange} size="small" name="rfid" id="rfid" fullWidth placeholder="RFID" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField variant="standard" onChange={formFmk.handleChange} size="small" name="username" fullWidth  id="username" placeholder="Username" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField variant="standard" onChange={formFmk.handleChange} size="small" name="item_id" fullWidth  id="item_id" placeholder="Item" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField  onChange={formFmk.handleChange} multiline={true} rows={3} size="small" name="description" fullWidth  id="description" placeholder="Description" />
                </Grid>
                <Grid item xs={6}>
                    <DesktopDatePicker
                            id="date_f"
                            variant="standard"
                            name="date_f"
                            label="Date From"
                            inputFormat="DD/MM/YYYY"
                            required
                            fullWidth
                            value={formFmk.values.date_f}
                            onChange={(val) => {
                                formFmk.setFieldValue("date_f", val, "")
                            }}
                            renderInput={(params) =>
                                <TextField {...params}
                                size="small"
                                id="date_f"
                                name="date_f"
                                style={{ width: '100%'}}
                                />}
                            />
                </Grid>
                <Grid item xs={6}>
                <DesktopDatePicker
                            id="date_to"
                            variant="standard"
                            name="date_to"
                            label="Date To"
                            inputFormat="DD/MM/YYYY"
                            required
                            fullWidth
                            value={formFmk.values.date_to}
                            onChange={(val) => {
                                formFmk.setFieldValue("date_to", val, "")
                            }}
                            renderInput={(params) =>
                                <TextField {...params}
                                size="small"
                                id="date_to"
                                name="date_to"
                                style={{ width: '100%'}}
                                />}
                            />
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