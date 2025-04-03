import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export function Auth(request){ 
    // console.log(request);
    let loginCookie = request.cookies.get('');
    console.log("loginCookie:", loginCookie);

    if (loginCookie ==  undefined){
        console.log("logincookiei");
        return NextResponse.rewrite(new URL('/login', request.url))
        NextResponse.redirect("http://localhost:3000/login");
    };
}