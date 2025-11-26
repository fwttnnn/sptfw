import { NextResponse, NextRequest } from "next/server"
import api from "@/lib/spotify/api"

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next()

  let accessToken  = req.cookies.get("sptfw--cookie:token/access")?.value!
  let refreshToken = req.cookies.get("sptfw--cookie:token/refresh")?.value!

  if (!accessToken && refreshToken) {
    const token = await api.token.refresh(refreshToken)
    accessToken = token["access_token"]

    response.cookies.set("sptfw--cookie:token/access", token["access_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: token["expires_in"] || 3600, // 1 hour(s)
    })

    /**
     * SEE: https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens#example
     */
    if (token["refresh_token"]) {
      refreshToken = token["refresh_token"]
      console.log("ref:", refreshToken)
      response.cookies.set("sptfw--cookie:token/refresh", token["refresh_token"], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year(s)
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /**
     * SEE: https://medium.com/@turingvang/nextjs-middleware-matcher-exclude-e37b74f4a426
     * 
     * apply middleware to all pages except:
     * 1. /api/* (exclude all API routes)
     * 2. /login (exclude the login page)
     * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     */
    '/((?!api|login|_next/static|_next/image).*)',
  ],
}
