import { Grid, TextField, Box, Divider, Button } from "@mui/material";
import { Formik, useFormik } from 'formik';
import * as yup from "yup";
import Autosync from "../../src/components/Fields/autoComplete";

export default function IForm(props){

    const {mode, data } = {...props}
    let initial_val = {}
    if (mode === 'create'){
        initial_val = {}
    } else {
        initial_val = {
            id: data.id,
            item_name: data.item_name,
            description: data.description,
            categories: {title: data.categories, value: data.category_id} 
        }
    }

    const BCSchema = yup.object({
        item_name: yup.string().required("Item Name is required"),
        description: yup.string().required("Description is required"),
        categories: yup.object().required("Description is required")
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
                    const newValue = {...values, categories: {connect : {id: values.categories.value} }}
                    await props.create(newValue);
                } else if (mode === 'edit'){
                    const newValue = {...values, categories: {connect : {id: values.categories.value} }}
                    //alert(JSON.stringify(newValue));
                    await props.write(values.id, newValue);
                }
            },700);
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
            <TextField variant="standard" value={formFmk.values.item_name} onChange={formFmk.handleChange} size="small" name="item_name" id="item_name" fullWidth placeholder="Item Name" required />
        </Grid>
        <Grid xs={6}></Grid>
        <Grid item xs={6}>
            <TextField variant="standard" value={formFmk.values.description} onChange={formFmk.handleChange} size="small" name="description" id="description" fullWidth  multiline
            rows={4}
            maxRows={4} placeholder="Description" required />
        </Grid>
        <Grid xs={6}></Grid>
        <Grid item xs={6}>
            <Autosync 
                id="categories" 
                label="Categories" 
                name="categories"
                value={formFmk.values.categories}
                onChange={(value) => {
                    if (!!value){
                        formFmk.setFieldValue("categories", value)
                    } else {
                        formFmk.setFieldValue("categories", "")
                    }
                }} 
                getListData={props.getList} 
                multiple={false}>
            </Autosync>
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