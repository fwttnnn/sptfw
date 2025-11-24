import { cookies } from "next/headers"

import Chart from "@/components/Chart"
import useProfile from "@/hooks/useProfile"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api";
import spotify from "@/data/spotify.json";

const _getData = async () => {
  const profile = await useProfile()
  if (!profile.id) {
    return spotify
  }

  const _data = await redis.get(`sptfw:${profile.id}`)!
  if (!_data) {
    const _cookies = await cookies()
    const token = _cookies.get("sptfw--cookie:profile/id")?.value!

    const top = await api.top(token, 1)
    await redis.set(`sptfw:${profile.id}`, top, {
      ex: 3 * 3600, // 3 hour(s)
    })

    return (top as typeof spotify)
  }

  /**
   * TODO: typescript considers _data as {}
   */
  return (_data as typeof spotify)
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
