import fs from "fs"
import spotify from "../data/spotify.js"

const EMOJIS = [
  "🎵","🎶","🎧","🎤","📀","💿","🎹","🥁","🎸","🎻",
  "🎷","🎺","🪗","🪘","🪕","✨","⭐","🌟","💫","🔥",
  "⚡","🌈","🌙","☀️","🌤️","⛅","☁️","🌧️","❄️","🌬️",
  "🍀","🌿","🍃","🌸","🌺","🌼","🌻","🌙","🌕","🌑",
  "💥","🌀","⭕","🟣","🔵","🟢","🟡","🟠","🔴","⚪",
  "⚫","⬛","⬜","🔶","🔷","🔸","🔹","🔺","🔻","⭐",
  "🌠","🎇","🎆","🎉","🎊","🪅","🎁","🧩","🎯","🎲",
  "🎭","📣","🔊","📡","🛰️","💡","🛸","🚀","🎈","💭"
]

spotify.items = spotify.items.map((t, i) => {
  return {
    // name: t.name,
    name: EMOJIS[i],
    popularity: t.popularity,
    // url: t.external_urls.spotify,
    url: "/api/spotify/auth/logout",
    album: {
      // name: t.album.name,
      name: "__name_album_default",
      // id: t.album.id,
      id: "__id_album_default",
      artists: [
        {
          // name: t.album.artists[0].name,
          name: "__name_artist_default",
        },
      ],
      images: [
        {
          // url: t.album.images[0].url,
          url: "",
        },
      ],
    },
  }
})

fs.writeFileSync("data/spotify.json", JSON.stringify(spotify, null, 2), "utf-8")
