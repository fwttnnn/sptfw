import Link from "next/link"
import Image from "next/image"

import Chart from "@/components/Chart"
import useProfile from "@/hooks/useProfile"

import { cookies } from "next/headers"
import { Profile } from "@/hooks/useProfile"

import spotify from "@/data/spotify.json"

import redis from "@/lib/redis"
import api from "@/lib/spotify/api"
import { Range } from "@/lib/spotify/api/user/top"

const _getData = async (profile: Profile, range: Range) => {
  if (!profile.id) return spotify

  const cached: typeof spotify | null = await redis.get(`sptfw:${profile.id}/${range}`)
  if (cached) return cached

  let accessToken  = (await cookies()).get("sptfw--cookie:token/access")?.value!
  if (!accessToken) {
    console.error("this doesn't get refreshed? should be after middleware")
    return spotify
  }

  const top = await api.user.top(accessToken, range, 1)
  await redis.set(`sptfw:${profile.id}`, top, {
    ex: 7 * 24 * 60 * 60, // 1 week(s)
  })

  return (top as typeof spotify)
}

export default async ({ searchParams }: { searchParams: { [key: string]: string | undefined }}) => {
  const ranges: Range[] = ["short", "medium", "long"];
  const range: Range = ranges.includes(searchParams["range"] as Range)
    ? (searchParams["range"] as Range)
    : "short"

  const profile = await useProfile()
  const authenticated: boolean = profile.id ? true : false

  const Body = async () => {
    if (!authenticated) {
      return (
        <div
          className="mx-12 my-3.5 text-xl"
        >
          <p
            className="text-justify"
          >
            how <span className="underline decoration-wavy">mediocre</span> is your taste in music? let data speaks for itself.
          </p>
          <br />
          <p
            className="text-justify"
          >
            you will get insights from within 1 week of listening (time range is customizable).
          </p>
          <br />
          <Link
            href={"/api/spotify/auth/login"}
            className="underline decoration-wavy"
            style={{
              color: "#1ed760"
            }}
          >
            login here!
          </Link>
        </div>
      )
    }

    return (
      <div
        className="flex flex-col items-center justify-center"
      >
        <Chart.Spotify
          data={await _getData(profile, range)}
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
          id="aaa"
          className="flex justify-end gap-4 px-12 whitespace-nowrap"
        >
          <Link
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="text-[21px]"
              // className="text-[clamp(10px,5vw,21px)]"
              
            >
              {profile.usn}'s
            </span>
          </Link>
          <Image
            src={profile.pict}
            alt={""}
            width={31}
            height={31}
          />
        </div>
        <div
          className="flex justify-center px-12"
        >
          <h1
            // className="text-6xl"
            // className="text-[clamp(2rem,5vw,4rem)]"
            className="text-6xl text-[clamp(0.5rem,11.5vw,3.75rem)] whitespace-nowrap"
            // className="text-6xl whitespace-nowrap"
          >
            spotify wrapped
          </h1>
        </div>
        <Body />
      </div>
    </main>
  )
}
