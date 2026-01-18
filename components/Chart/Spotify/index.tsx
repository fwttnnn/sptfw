"use client"

import gsap from "gsap"
import { useRef, useState, useEffect } from "react"

import Link from "next/link"

import * as d3 from "d3"

import useTooltip from "@/hooks/useTooltip"
import spotify from "@/data/spotify.json"

export type Args = {
  data: typeof spotify,
  size?: number,
  width?: number,
  height?: number,

  /**
   * NOTE: ignore, only used for supabase
   */
  __uid?: string,
}

/**
 * update telemetry
 */
const telemetry = {
  axis: (uid: string | undefined) => {
    if (!uid) {
      return
    }

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: uid, type: "hover__axis" }),
    }).catch(() => {})
  },
  album: (uid: string | undefined, aid: string) => {
    if (!uid) {
      return
    }

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: uid, aid: aid, type: "hover__album" }),
    }).catch(() => {})
  }
}

export default ({ data, width = 500, height = 500, __uid }: Args) => {
  const [_width, setWidth] = useState(width)
  const [_height, setHeight] = useState(height)

  data.items.sort((t) => t.popularity)
  const setTooltip = useTooltip((state) => state.setTooltip)

  const margin = { top: 40, right: 10, bottom: 20, left: 20 }
  const innerWidth = _width - margin.left - margin.right
  const innerHeight = _height - margin.top - margin.bottom

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

  const _actualHeight = margin.top
                      + Math.max(...bucketHeights)
                      + margin.bottom

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${_width+10} ${_actualHeight}`}  // original D3 width/height
      preserveAspectRatio="xMidYMin meet"
      // preserveAspectRatio="xMidYMid meet"
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
        />
        <rect
          x={0 - 10}
          y={-20}
          width={innerWidth+20}
          height={20}
          fill="transparent"
          onMouseEnter={() => {
            telemetry.axis(__uid)
            setTooltip(true,  `popularity (%)`)
          }}
          onMouseLeave={() => {
            setTooltip(false, `popularity (%)`)
          }}
        />
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
                  telemetry.album(__uid, t.album.id)
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
                  onMouseEnter={() => {
                    telemetry.axis(__uid)
                    setTooltip(true, `popularity (%)`)
                  }}
                  onMouseLeave={() => { 
                    setTooltip(false, `popularity (%)`)
                  }}
                />
                <text
                  x={x(r)}
                  y={-10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12}
                  onMouseEnter={() => {
                    telemetry.axis(__uid)
                    setTooltip(true,  `${r}% popular`)
                  }}
                  onMouseLeave={() => {
                    setTooltip(false, `${r}% popular`)
                  }}
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
