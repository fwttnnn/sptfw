"use client"

import gsap from "gsap"
import { useRef } from "react"

import Link from "next/link"

import * as d3 from "d3"
import spotify from "@/data/spotify.json"

import useTooltip from "@/hooks/useTooltip"

export type Args = {
  data: typeof spotify,
  size?: number,
  width?: number,
  height?: number,
}

export default ({ data, width = 500, height = 500 }: Args) => {
  data.items.sort((t) => t.popularity)
  const setTooltip = useTooltip((state) => state.setTooltip)

  const margin = { top: 40, right: 15, bottom: 20, left: 15 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const range = d3.range(0, 100 + 1, 10)
  const p = d3.scaleQuantize()
    .domain([range[0], range[range.length - 1]])
    .range(range)

  const x = d3.scaleLinear()
    .domain([range[0], range[range.length - 1]])
    .range([0, innerWidth])
  
  const rectSize = 43
  const rectSpacing = 4

  const bucketHeights = range.map(r => {
    const tracks = data.items.filter(t => p(t.popularity) === r)
    return 15 + tracks.length * (rectSize + rectSpacing)
  })

  const _height = margin.top
                + Math.max(...bucketHeights)
                + margin.bottom

  return (
    <svg
      width={width}
      height={_height}
    >
      <g
        transform={`translate(${margin.left},${margin.top})`}
      >
        <line
          x1={0}
          y1={0}
          x2={innerWidth}
          y2={0}
          stroke="currentColor"
          // strokeDasharray="5 4"
        />
        <rect
          x={0 - 10}
          y={-20}
          width={innerWidth+20}
          height={20}
          fill="transparent"
          // fill="currentColor"
          // onMouseEnter={() => setTooltip(true,  `🠀 niche`)}
          // onMouseEnter={() => setTooltip(true,  `popular 🠂`)}
          onMouseEnter={() => setTooltip(true,  `popularity (%)`)}
          onMouseLeave={() => setTooltip(false, `popularity (%)`)}
        />
        {/* <text
          x={-5}
          y={54}
          fill="currentColor"
          opacity={70}
          fontSize={15}
        >
          popularity %
        </text> */}
        {range.map((r: number) => {
          const tracks = data.items
            .filter((t) => p(t.popularity) === r)
            .sort((a, b) => {
              const artistA = a.album.artists[0].name
              const artistB = b.album.artists[0].name

              const artistCmp = artistA.localeCompare(artistB)
              if (artistCmp !== 0) return artistCmp

              const albumA = a.album.name
              const albumB = b.album.name

              const albumCmp = albumA.localeCompare(albumB)
              if (albumCmp !== 0) return albumCmp

              /**
               * NOTE: compare by track name (title)
               */
              return a.name.localeCompare(b.name)
            })

          return (
            <g
              key={`${r}-root`}
            >
              {tracks.map((t, i) => {
                const ref = useRef(null)

                const Album = ({ url }: { url: string }) => {
                  if (!url) {
                    return (
                      <rect
                        ref={ref}
                        x={x(r) - rectSize / 2}
                        y={15 + i * (rectSize + rectSpacing)}
                        width={rectSize}
                        height={rectSize}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={1}
                      />
                    )
                  }

                  return (
                    <image
                      ref={ref}
                      href={url}
                      x={x(r) - rectSize / 2}
                      y={15 + i * (rectSize + rectSpacing)}
                      width={rectSize}
                      height={rectSize}
                      preserveAspectRatio="xMidYMid slice"
                      // preserveAspectRatio="cover"
                    />
                  )
                }

                const handleMouseEnter = () => {
                  setTooltip(true, t.name)

                  if (!ref.current) {
                    return
                  }

                  gsap.to(ref.current, {
                    overwrite: true,
                    scale: 0.8,
                    duration: 0.2,
                    ease: "power3.out",
                    transformOrigin: "50% 50%",
                  })
                }

                const handleMouseLeave = () => {
                  setTooltip(false, t.name)

                  if (!ref.current) {
                    return
                  }

                  gsap.to(ref.current, {
                    overwrite: true,
                    scale: 1,
                    duration: 1.0,
                    ease: "power3.out",
                    transformOrigin: "50% 50%",
                  })
                }

                return (
                  <g
                    key={`${r}-high-${t}-${i}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={t.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Album url={t.album.images[0].url} />
                    </Link>
                  </g>
                )
              })}

              <g
              >
                <circle
                  stroke="white"
                  cx={x(r)}
                  cy={0}
                  r={4}
                  fill="black"
                />
                <text
                  x={x(r)}
                  y={-10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12}
                  onMouseEnter={() => setTooltip(true,  `${r}% popular`)}
                  onMouseLeave={() => setTooltip(false, `${r}% popular`)}
                >
                  {r === 0 ? "00" : r}
                </text>
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
