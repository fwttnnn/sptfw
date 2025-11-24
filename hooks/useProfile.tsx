import { cookies } from "next/headers"

export type Profile = {
  id:   string,
  url:  string,
  usn:  string,
  pict: string,
}

export default async (): Promise<Profile> => {
  const _cookies = await cookies()
  
  const id   = _cookies.get("sptfw--cookie:profile/id")?.value
  const usn  = _cookies.get("sptfw--cookie:profile/usn")?.value
  const pict = _cookies.get("sptfw--cookie:profile/pict")?.value

  if (!id || !usn || !pict) {
    return {
      id: "",
      url: "/",
      usn: "unknown",
      pict: "https://i.pinimg.com/originals/07/c6/81/07c681507e673bdf54c54c64bc89c1d6.gif",
      // pict: "https://i.pinimg.com/736x/b0/ec/2f/b0ec2f74089cd9a829364c6d32c0208f.jpg",
      // pict: "https://i.pinimg.com/originals/9a/34/00/9a3400cf6462af28cbcac7a8ee13efd7.gif",
    }
  }

  return {
    id,
    url: `https://open.spotify.com/user/${id}`,
    usn,
    pict: `https://i.scdn.co/image/${pict}`
  }
}
