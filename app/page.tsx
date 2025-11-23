import Chart from "@/components/Chart"
import spotify from "@/data/spotify"

export default () => {
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
            data={spotify}
          />
        </div>
      </div>
    </main>
  )
}
