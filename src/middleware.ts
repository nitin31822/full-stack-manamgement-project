
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const token = await getToken({req : request})
    if (token && 
        (
            url.pathname.startsWith("/login") ||
            url.pathname.startsWith("/register") ||
            url.pathname.startsWith("/verify") 
            // url.pathname.startsWith("/") 
        )
    ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login" , request.url))
    }
  
}
 

export const config = {
  matcher: [
    '/login' ,
    "/register",
    "/" ,
    // "/dashboard/:path*",
    // "/verify/path*"
]
}