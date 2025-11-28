export type Range = "short" | "medium" | "long"

export default async (token: string, range: Range, depth: number): Promise<{[key: string]: any}> => {
  let data: any = {
    items: [],
    next: null,
  }

  for (let i = 0; i < depth; i++) {
    const params = new URLSearchParams()
    params.append("time_range", `${range}_term`)
    params.append("limit", String(50))

    const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })

    console.log("top --result:", result)
    const json = await result.json()
    console.log("top:", json)
    json.items.forEach((t: any) => {
      data.items.push({
        name: t.name,
        url: t.external_urls.spotify,
        popularity: t.popularity,
        album: {
          name: t.album.name,
          id: t.album.id,
          // artists: t.album.artists.map((a: any) => ({
          //   name: a.name,
          // })),
          artists: [
            {
              name: t.album.artists[0].name,
            },
          ],
          images: [
            {
              url: t.album.images[0].url,
            },
          ],
        },
      })
    })

    data.next = json.next
  }

  return data
}
