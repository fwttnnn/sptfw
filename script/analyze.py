from dotenv import dotenv_values
from functools import reduce
from supabase import create_client, Client

env = dotenv_values()

url: str = env["SPTFW_SUPABASE_URL"]
key: str = env["SPTFW_SUPABASE_KEY"]
supabase: Client = create_client(url, key)

hovers = {
  "axis":  list(filter(lambda d: not d["uid"].startswith("__unused_"),
                       (supabase.table("hover__axis").select("*").execute().data))),
  "album": list(filter(lambda d: not d["uid"].startswith("__unused_"),
                       (supabase.table("hover__album").select("*").execute().data)))
}

users = set(list(map(lambda d: d["uid"], hovers["axis"])) +
            list(map(lambda d: d["uid"], hovers["album"])))

def __rkt_axis():
    axis = set(list(map(lambda d: d["uid"], hovers["axis"])))
    return sum(map(lambda u: u in axis, users)) / len(users)

def __rkt_album():
    __ALBUM_CARDINALITY__ = 50
    album = list(map(lambda d: d["uid"], hovers["album"]))
    return sum(map(lambda u:
                   min(len(list(filter(lambda d: d == u, album))), __ALBUM_CARDINALITY__) / __ALBUM_CARDINALITY__,
                   users)) / len(users)

print(f"{__rkt_axis():.2f} {__rkt_album():.2f}")

