import { Grid, TextField, Box, Divider, Button } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from "yup";
export default function IForm(props){

    const initial_val = { ...props}
    const BCSchema = yup.object({
        itemName: yup.string().required("Item Name is required"),
        categoryName: yup.string().required("Category Name is required"),
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
        <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>ITEM</Box>
            <Divider />
        </Grid>
        <Grid item xs={6}>
            <TextField variant="standard" onChange={formFmk.handleChange} size="small" name="itemName" id="itemName" fullWidth placeholder="Item Name" required />
        </Grid>
        <Grid xs={6}></Grid>
        <Grid item xs={6}>
            <select variant="standard" name="categoryName" id="categoryName" >
                <option value="IT">IT</option>
            </select>
        </Grid>
        <Grid xs={6}></Grid>
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