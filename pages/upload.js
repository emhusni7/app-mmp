import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Container,Box, Typography, Button, ListItem, Grid, TextField, IconButton } from "@mui/material";
import LinearProgress from "@mui/material";
import { WithStyles } from "@mui/styles";
import SyncIcon from '@mui/icons-material/Sync';
import { PersentProgressBars, CustomizedProgressBars } from "../src/components/Layout/loader";
import axios from "axios";
import path from 'path';

    export default function UploadButtons(props) {

        //console.log(props.pathname);
        const [pathname, setPath] = useState(props.pathname);
        const [progress, setProgress] = useState(0);
        const [loading, setLoading] = useState(false);


        // const uploadToServer = async (event) => {
        //   setProgress(0);
        //   const body = new FormData();
        //   body.append("file", file, file.name);
        //   axios.post("/api/mdbc", body, {
        //     onUploadProgress: (progressEvent) => {
        //       const percentage = Math.round(
        //         (progressEvent.loaded * 100) / progressEvent.total
        //       );
        //       setProgress(percentage);
        //     }
        //   }).then((resp) => {
        //     console.log(resp);
        //   })
        //   .catch((error) => console.log(error));
        // }

        const syncData = async() => {
          setLoading(true)
          const res = await fetch("/api/mdbc",{
            method: "PUT",
            headers:{
              "Content-Type": 'application/json'
            }
          })
          const data = await res.json();
          setLoading(false);
          if (res.status === 200){
            props.createNotif('success', 'Data Karyawan Has Been Syncronized')
          } else {
            props.createNotif('error', data.message)
          }

        }

      //   const handleOnChange = e => {
      //     var file = e.target.files[0];
      //     let reader = new FileReader();
      //     reader.readAsDataURL(file);
      //     reader.onload = () => {
      //       setPath(reader.result)
      //       console.log(reader.result);
      //     };
      //     reader.onerror = function (error) {
      //       console.log('Error: ', error);
      //     }
      //     //setFile(e.target.files[0]);
      // };

        return (<>
                
                <Grid container sx={{ mt:2}} spacing={1}>
                  <Grid item xs={6}>{loading ? (<CustomizedProgressBars />) : ""}</Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <TextField
                      error
                      id="pathname"
                      name="pathname"
                      label="Pathname"
                      inputProps={{ readOnly: true }}
                      fullWidth
                      variant="standard"
                      defaultValue={pathname}
                      value={pathname}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="Input File karyawan.mdb"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" onClick={() => syncData()}><SyncIcon>Sync</SyncIcon></Button>
                  </Grid>
                </Grid>
          </>          
      )}


  export const getStaticProps = async() => {
    const pathname = path.join(process.cwd(), "data");

    return {
      props: {pathname: pathname }
    }
  }