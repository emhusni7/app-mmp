import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from "cookies-next";

export default async function middleware(req, res) {
    const { pathname } = req.nextUrl;
    let akses = false;
    if(pathname.match(/api.*/) ||
       pathname == "/" ||
        pathname.match(/static.*/)||
        pathname.match(/login.*/) || 
        pathname.match(/sw.*/) ||
        !getCookie('menu', {req, res})
        ){
      return NextResponse.next()
    } 
    else {
      const menus = JSON.parse(getCookie('menu', {req, res}));
      console.log(pathname.replace("/",""));
      menus.map((x) => {
        if (pathname.includes(x.name)){
          akses = true;
          return true
        }   
      })
    }
    if (!akses){
      return NextResponse.rewrite(new URL(`/not-found`, req.url));
    }
    return NextResponse.next()
  }