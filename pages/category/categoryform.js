import { Grid, TextField, Box, Divider, Button } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from "yup";
export default function CForm(props){
    const {mode, data } = {...props}
    let initial_val = {}
    if (mode === 'create'){
        initial_val = {}
    } else {
        initial_val = data
    }
    const BCSchema = yup.object({
        category_name: yup.string().required("Category Name is required"),
    })
    

    const formFmk = useFormik({
        initialValues: initial_val,
        validationSchema: BCSchema,
        onSubmit: (values, { 
          setSubmitting, resetForm
         }) => {
            setTimeout(async() => {
                resetForm(initial_val);
                if (mode === 'create'){
                    await props.create(values);
                } else if (mode === 'edit'){
                    await props.write(values.id, values);
                }
            },700);
        },
      });
    
    return (
    <form onSubmit={formFmk.handleSubmit}>
    <Grid container spacing={1}>
        <Grid item xs={12}>
            <Box sx={{color: '#3f51b5', fontSize: 25, fontWeight: 'bold'}}>Category</Box>
            <Divider />
        </Grid>
        <Grid item xs={6}>
            <TextField value={formFmk.values.category_name} variant="standard" onChange={formFmk.handleChange} size="small" name="category_name" id="category_name" fullWidth placeholder="Category Name" required />
        </Grid>
        <Grid xs={6}></Grid>
        <Grid item xs={12}>
            <Divider />
            <br></br>
            <Button  variant="contained" type="submit">Save</Button>
            <Button sx={{pl:4}} onClick={props.onClose} color="error">
                    Cancel
            </Button> 
         </Grid>
        
    </Grid></form>)
}