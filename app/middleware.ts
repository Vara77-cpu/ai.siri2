import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req:any){

  const token = await getToken({ req })

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if(isAdminRoute){
    if(!token || token.role !== "admin"){
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}