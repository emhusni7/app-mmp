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
        !getCookie('user', {req, res})
        ){
      return NextResponse.next()
    } 
    else {
      const menus = JSON.parse(getCookie('user', {req, res}));
      menus.menu.map((x) => {
        if (pathname.includes(x.path)){
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