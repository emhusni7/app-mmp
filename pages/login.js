
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import {CustomizedProgressBars} from '../src/components/Layout/loader';


const validationSchema = yup.object({
    username: yup
      .string('Username')
      .required('Username is required'),
    password: yup
      .string('Enter your password')
      .min(4, 'Password should be of minimum 4 characters length')
      .required('Password is required'),
  });

const styles = {
    formBody:{
        width: "100%",
        height: "100%",
        background: "#556cd6",    
    },
    formC : {
        width: "330px",
        margin: "0 auto",
        display: "flex",
        background: "white",
        padding: "20px",
    }
}

function LoginForm() {
  const router = useRouter();
  const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { setSubmitting, setErrors}) => {
        setSubmitting(true);
        const params = {
          username: values.username,
          password: values.password,
          state: values.state,
          login: true,
        }
        const res = await fetch('api/user',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params),
        });
        const response = await res.json();
        setSubmitting(false)
        if (res.status === 200){
          router.push('/');
        } else{
          setErrors({'password': response.message, 'username': ''})
        }
        
      },
    });


    return (
      <Container component="main" maxWidth={false}>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          bgcolor: '#77bfea'
        }}
      >
        <Box
          sx={{
            margin: 'auto',
            bgcolor: '#fff',
            boxShadow: 1,
            borderRadius: 2,
            width: '60%',
            height: '70%', 
          }}
        >
           <Grid container sx={{height: '100%'}}>
              <CssBaseline />
              <Grid
                item
                xs={6}
                sx={{
                  backgroundImage: "url(/static/mmp.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  alignItems:"stretch",
                  flexDirection:'row',
                }}
              ></Grid>
          <Grid
            item
            xs={6}
            sx={{
              p: 10
            }}
          >
              <Typography component="h1" variant="h5">
                <h2>Sign In</h2>
              </Typography>
                <form onSubmit={formik.handleSubmit
                }>
              <TextField
                fullWidth
                id="username"
                name="username"
                variant="outlined"
                style={{ margin: "0px 0px 10px"}}
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
          
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                style={{ margin: "0px 0px 10px"}}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <div>{formik.isSubmitting ? (<CustomizedProgressBars />) : ("")}</div>
              <br />
              <Button color="primary" variant="contained" fullWidth type="submit">
                Login
              </Button>
         
            </form> 
           </Grid>
           </Grid>
          
        </Box>
        {/* 
        <Grid container>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={6}
            md={6}
            sx={{
              backgroundImage: "url(/static/mmp.jpeg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography component="h1" variant="h5">
                <h2>Sign In</h2>
              </Typography>
                <form onSubmit={formik.handleSubmit
                }>
              <TextField
                fullWidth
                id="username"
                name="username"
                variant="outlined"
                style={{ margin: "0px 0px 10px"}}
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
          
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                style={{ margin: "0px 0px 10px"}}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <div>{formik.isSubmitting ? (<CustomizedProgressBars />) : ("")}</div>
              <br />
              <Button color="primary" variant="contained" fullWidth type="submit">
                Login
              </Button>
         
            </form> 
            </Box>
          </Grid>
        </Grid>
         */}
      </Box>
    </Container>
   
    );
  };

export default LoginForm;

