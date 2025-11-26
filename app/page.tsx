import Link from "next/link"

import Chart from "@/components/Chart"
import useProfile from "@/hooks/useProfile"

import { cookies } from "next/headers"
import { Profile } from "@/hooks/useProfile"

import spotify from "@/data/spotify.json"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api"

const _getData = async (profile: Profile) => {
  if (!profile.id) return spotify

  const cached: typeof spotify | null = await redis.get(`sptfw:${profile.id}`)
  if (cached) {
    redis.del(`sptfw:${profile.id}`)
    return cached
  }

  let accessToken  = (await cookies()).get("sptfw--cookie:token/access")?.value!
  if (!accessToken) {
    console.error("this doesn't get refreshed? should be after middleware")
    return spotify
  }

  const top = await api.user.top(accessToken, 1)
  await redis.set(`sptfw:${profile.id}`, top, {
    ex: 3 * 3600, // 3 hour(s)
  })

  return (top as typeof spotify)
}

export default async () => {
  const profile = await useProfile()
  const authenticated: boolean = profile.id ? true : false

  const Body = async () => {
    if (!authenticated) {
      return (
        <div
          className="mx-12 my-3.5"
        >
          <p
            className="text-xl"
          >
            get yours now, {""}
            <Link
              href={"/api/spotify/auth/login"}
              className="underline"
              style={{
                color: "#1ed760"
              }}
            >
              login
            </Link>
            {""} using spotify
          </p>
        </div>
      )
    }

    return (
      <div
        className="flex flex-col items-center justify-center"
      >
        <Chart.Spotify
          data={await _getData(profile)}
          __uid={profile.id}
        />
      </div>
    )
  }

  return (
    <main>
      <div
        className="flex flex-col gap-[24px]"
      >
        <div
          className="flex justify-center px-12"
        >
          <h1
            // className="text-6xl"
            // className="text-[clamp(2rem,5vw,4rem)]"
            // className="text-6xl text-[clamp(1rem,11.5vw,4rem)] whitespace-nowrap"
            className="text-6xl whitespace-nowrap"
          >
            spotify wrapped
          </h1>
        </div>
        <Body />
      </div>
    </main>
  )
}
