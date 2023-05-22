import { Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import {CardActionArea} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CircularProgressWithLabel from '../src/components/Layout/circularProgress';
import { getCookie } from "cookies-next";
import Box from '@mui/material/Box';

export default function Index() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [menus, setMenu] = useState([]);
    console.log(process.cwd());

    useEffect(() => {
        const access = eval(getCookie('menu'));
        setMenu(access);
        () => {}
    }, [])

    const pageRoute = (page) => {
        setLoading(true);
        router.push(`/${page}`);
    }
    
    return (
        <section>
            <>ini index</>
        </section>)
}
