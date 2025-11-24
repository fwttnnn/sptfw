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
    url: "/api/spotify/auth/login",
    album: {
      // name: t.album.name,
      name: "?",
      artists: [
        {
          // name: t.album.artists[0].name,
          name: "?",
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

fs.writeFileSync("data/_spotify.json", JSON.stringify(spotify, null, 2), "utf-8")
