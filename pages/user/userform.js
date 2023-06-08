import { Grid, TextField, Box, Divider, Button } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from "yup";
import Autosync from "../../src/components/Fields/autoComplete";

export default function UForm(props){
    const {mode, data } = {...props}
    let initial_val = {}
    if (mode === 'create'){
        initial_val = {}
    } else {
        let newctg = []
        if(data.categories){
            newctg = data.categories.map((x) => ({title: x.category.category_name, value: x.category.id}))
        }
        initial_val = {...data, categories: newctg}
    }
    
    
    const BCSchema = yup.object({
        username: yup.string().required("Username Is Required"),
        password: yup.string().required("Password Is Required"),
       
    })
    
    const formFmk = useFormik({
        initialValues: initial_val,
        validationSchema: BCSchema,
        onSubmit: (values, { resetForm
        
         }) => {
            // alert("tes");
            setTimeout(async() => {
                resetForm(initial_val);
                
                const newVal = values.categories.map((x) => (
                    {category:
                        {connect:
                                {id : x.value}
                        }
                    }))
                if (mode === 'create'){
                    const newValue = {...values, categories: {create : newVal}}
                    await props.create(newValue);
                } else if (mode === 'edit'){
                    const newValue = {...values, categories: {
                            deleteMany: {},
                            create : newVal
                        }   
                    }
                    await props.write(values.id, newValue);
                }
            },700);            
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
            <TextField variant="standard" value={formFmk.values.username} onChange={formFmk.handleChange} size="small" name="username" id="username" fullWidth placeholder="Username" required />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
            <TextField variant="standard" value={formFmk.values.password} onChange={formFmk.handleChange} size="small" name="password" type="password" fullWidth  id="password" placeholder="Password" required />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
            <Autosync 
                id="categories" 
                label="Categories" 
                name="categories"
                value={formFmk.values.categories}
                onChange={(value) => {
                   
                   formFmk.setFieldValue("categories", value)
                }} 
                getListData={props.getList} 
                multiple={true}>
            </Autosync>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
            <Divider />
            <br></br>
            <Button  variant="contained" type="submit">{mode === 'create' ? 'Simpan' : 'Update'}</Button>
            <Button sx={{pl:4}} onClick={props.onClose} color="error">
                    Cancel
            </Button> 
         </Grid>
        
    </Grid></form>)
}