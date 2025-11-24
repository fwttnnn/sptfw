import { NextRequest, NextResponse } from "next/server"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api"
import pkce from "@/lib/spotify/pkce"

export const GET = async (request: NextRequest) => {
  const _url = new URL(request.url)
  const code = _url.searchParams.get("code")!

  if (!code) {
    return NextResponse.json({})
  }

  const verifier = request.cookies.get("sptfw--cookie:verifier")?.value
  const token = await pkce.getToken(process.env.SPTFW_API_CID!, code, verifier!, `${process.env.SPTFW_HOST_URI!}/api/spotify/auth/callback`)

  const _access = token["access_token"]
  const profile = await api.profile(_access)

  const top = await api.top(_access, 1)
  await redis.set(`sptfw:${profile.id}`, top, {
    ex: 3 * 3600, // 3 hour(s)
  })

  const response = NextResponse.redirect(process.env.SPTFW_HOST_URI!)

  response.cookies.set("sptfw--cookie:token/access", token["access_token"], {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: token["expires_in"] || 3600, // 1 hour(s)
  })

  response.cookies.set("sptfw--cookie:token/refresh", token["refresh_token"], {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year(s)
  })

  response.cookies.set("sptfw--cookie:profile/id", profile["id"], {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year(s)
  })

  response.cookies.set("sptfw--cookie:profile/usn", profile["display_name"], {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year(s)
  })

  /**
   * NOTE: store only the image id
   */
  response.cookies.set("sptfw--cookie:profile/pict", profile["images"][0]["url"].split("/").pop(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year(s)
  })

  return response
}
