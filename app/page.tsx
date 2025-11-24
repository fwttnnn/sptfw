import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import Chart from "@/components/Chart"
import useProfile from "@/hooks/useProfile"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api"
import spotify from "@/data/spotify.json"

const _getData = async () => {
  const profile = await useProfile()
  if (!profile.id) return spotify

  const cached: typeof spotify | null = await redis.get(`sptfw:${profile.id}`)
  if (cached) return cached

  const _cookies = await cookies()

  const refreshToken = _cookies.get("sptfw--cookie:token/refresh")?.value!
  let accessToken    = _cookies.get("sptfw--cookie:token/access")?.value!

  if (!accessToken && refreshToken) {
    const token = await api.token.refresh(refreshToken)
    accessToken = token["access_token"]

    const response = NextResponse.next()
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
      response.cookies.set("sptfw--cookie:token/refresh", token["refresh_token"], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year(s)
      })
    }
  }

  if (!accessToken) return spotify

  const top = await api.user.top(accessToken, 1)
  await redis.set(`sptfw:${profile.id}`, top, {
    ex: 3 * 3600, // 3 hour(s)
  })

  return (top as typeof spotify)
}

export default async () => {
  return (
    <main>
      <div
        className="flex flex-col gap-[24px]"
      >
        <h1
          className="text-6xl text-center"
        >
          spotify wrapped
        </h1>
        <div
          className="flex flex-col items-center justify-center"
        >
          <Chart.Spotify
            data={await _getData()}
          />
        </div>
      </div>
    </main>
  )
}
