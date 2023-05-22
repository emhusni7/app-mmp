import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Container,Box, Typography, Button, ListItem, Grid, TextField, IconButton } from "@mui/material";
import LinearProgress from "@mui/material";
import { WithStyles } from "@mui/styles";
import SyncIcon from '@mui/icons-material/Sync';
import { PersentProgressBars } from "../src/components/Layout/loader";
import axios from "axios";

    export default function UploadButtons() {

        const [file, setFile] = useState(null);
        const [pathname, setPath] = useState("");

      
        useEffect( async() => {
        
          const apiDt = await fetch('/api/mdbc',{
              method: "GET",
              headers:{
                "Content-Type": 'application/json'
              }
            })
            const res =await apiDt.json()
            setPath(res.path);
        },[])

        const uploadToServer = async (event) => {
          const body = new FormData();
          body.append("file", file, file.name);
          const response = await fetch("/api/mdbc", {
            method: "POST",
            body
          });
        }

        const syncData = async() => {
          const res = await fetch()
        }

        const handleOnChange = e => {
          console.log(e.target.files[0]);
          setFile(e.target.files[0]);
      };

        return (<>
                <Grid container spacing={1}>
                  <Grid item xs={6}><PersentProgressBars progress={25} ></PersentProgressBars></Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Button
                        fullWidth
                        className="btn-choose"
                        variant="outlined"
                        component="label" >
                      <input
                        id="btn-upload"
                        name="btn-upload"
                        type="file"
                        onChange={(e) => handleOnChange(e)} 
                        />
                      
                        Choose Files
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                    <Button
                      className="btn-upload"
                      color="primary"
                      variant="contained"
                      component="span"
                    //   disabled={!selectedFiles}
                    onClick={(e) => uploadToServer(e)}
                    >
                      Upload
                    </Button>
                  
                  </Grid>
                </Grid>
                <Grid container sx={{ mt:2}} spacing={1}>
                  <Grid item xs={6}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined"><SyncIcon>Sync</SyncIcon></Button>
                  </Grid>
                </Grid>
          </>          
      )}