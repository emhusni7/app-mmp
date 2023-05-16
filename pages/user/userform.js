import { Grid, TextField, Box, Divider, Button } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from "yup";
export default function UForm(props){

    const initial_val = { ...props}
    const BCSchema = yup.object({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
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
    <Grid container spacing={2}>
        <Grid item xs={12}>
        <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>USER</Box>
            <Divider />
        </Grid>
        <Grid item xs={6}>
            <TextField variant="standard" onChange={formFmk.handleChange} size="small" name="username" id="username" fullWidth placeholder="Username" required />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
            <TextField variant="standard" onChange={formFmk.handleChange} size="small" name="password" type="password" fullWidth  id="password" placeholder="Password" required />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
            <Divider />
            <br></br>
            <Button  variant="contained" type="submit">Simpan</Button>
            <Button sx={{pl:4}} onClick={props.onClose} color="error">
                    Cancel
            </Button> 
         </Grid>
        
    </Grid></form>)
}