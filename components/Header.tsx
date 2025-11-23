import Link from "next/link"
import Image from "next/image"

import useProfile from "@/hooks/useProfile"

export default async () => {
  const profile = await useProfile()

  const _Image = () => {
    const img = (
      <Image
        src={profile.pict}
        alt={"?"}
        width={31}
        height={31}
      />
    )

    return (!profile.id
      ? <Link href="/api/spotify/auth/login">{img}</Link>
      : img)
  }

  return (
    <header
      className="mb-6"
    >
      {/**
       * TODO: spacing (pads, margs) needs work
       */}
      <div
        className="flex justify-end gap-4 px-12"
      >
        <Link
          href={profile.id}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className="text-[21px]"
          >
            {profile.usn}'s
          </span>
        </Link>
        <_Image />
      </div>
    </header>
  )
}

