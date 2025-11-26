import Link from "next/link"
import Image from "next/image"

import useProfile from "@/hooks/useProfile"

export default async () => {
  const profile = await useProfile()
  const authenticated: boolean = profile.id ? true : false

  // if (!authenticated) {
  //   return <></>
  // }

  return (
    <header
      className="mb-6"
    >
      {/**
       * TODO: spacing (pads, margs) needs work
       */}
      <div
        className="flex justify-end gap-4 px-12 whitespace-nowrap"
      >
        <Link
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className="text-[21px]"
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
    </header>
  )
}

