import { NextRequest, NextResponse } from "next/server"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api"
import pkce from "@/lib/spotify/pkce"

export const GET = async (request: NextRequest) => {
  const response = NextResponse.redirect(process.env.SPTFW_HOST_URI!)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (!code) {
    return response
  }

  const verifier = request.cookies.get("sptfw--cookie:verifier")?.value!
  const token = await pkce.getToken(process.env.SPTFW_API_CID!,
                                    code,
                                    verifier,
                                    `${process.env.SPTFW_HOST_URI!}/api/spotify/auth/callback`)

  const accessToken = token["access_token"]
  const profile = await api.user.profile(accessToken)

  const top = await api.user.top(accessToken, 1)
  await redis.set(`sptfw:${profile.id}`, top, {
    ex: 7 * 24 * 60 * 60, // 1 week(s)
  })

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

  response.cookies.set("sptfw--cookie:token/code", code, {
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

  const imageURL = profile["images"]?.[0]?.["url"] || ""

  /**
   * NOTE: store only the image id
   */
  if (imageURL) {
    response.cookies.set("sptfw--cookie:profile/pict", imageURL.split("/").pop()!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year(s)
    })
  }

  return response
}
