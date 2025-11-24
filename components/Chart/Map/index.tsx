import React from "react"

import * as d3 from "d3"
const tj: any = {}

export type Args = {
  data: any,
  width?: number,
  height?: number,
} & React.SVGProps<SVGSVGElement>

// 1B
// 1F
// 1R
// 2B
// 2H
// T31

export default ({ data, width = 500, height = 500, ...svgProps }: Args) => {
  const margin = 10

  const routeId = "1R"
  const route = tj.routes.find((r: any) => r.route_id === routeId)
  if (!route) throw new Error("Route not found")

  const trip = tj.trips.find((t: any) => t.route_id === routeId)
  if (!trip) throw new Error("Trip not found")

  const shapeId = trip.shape_id
  const shapePoints = tj.shapes
    .filter((s: any) => s.shape_id === shapeId)
    .sort((a: any, b: any) => a.shape_pt_sequence - b.shape_pt_sequence)

  const stopIds = tj.stoptimes
    .filter((s: any) => s.trip_id == trip.trip_id)
    .map((s: any) => s.stop_id)

  const routeStops = tj.stops.filter((s: any) => stopIds.includes(s.stop_id))

  const routeShape: any = {
    type: "Feature",
    geometry: {
      type: "GeometryCollection",
      geometries: [
        {
          type: "LineString",
          coordinates: shapePoints.map((p: any) => [p.shape_pt_lon, p.shape_pt_lat])
        },
        // ...routeStops.map(s => ({
        //   type: "Point",
        //   coordinates: [s.stop_lon, s.stop_lat]
        // }))
      ]
    },
    properties: {
      route_id: route.route_id,
      route_name: route.route_long_name || route.route_short_name,
      route_color: route.route_color
    }
  }

  const projection = d3.geoMercator()
    .fitExtent([[margin, margin], [width - margin, height - margin]], routeShape)

  const pathGenerator = d3.geoPath().projection(projection)

  const projectedStops = routeStops.map((s: any) => projection([s.stop_lon, s.stop_lat]))

  const margin2 = margin + 9
  const projection2 = d3.geoMercator()
    .fitExtent([[margin2, margin2], [width - margin2, height - margin2]], routeShape)

  const pathGenerator2 = d3.geoPath().projection(projection2)

  const margin3 = margin + 18
  const projection3 = d3.geoMercator()
    .fitExtent([[margin3, margin3], [width - margin3, height - margin3]], routeShape)

  const pathGenerator3 = d3.geoPath().projection(projection3)


  return (
    <svg width={width} height={height} {...svgProps}>
      <path
        fill="none"
        strokeWidth={2}
        stroke="#00aeffff"
        d={pathGenerator(routeShape)!}
      />
      <path
        fill="none"
        strokeWidth={2}
        stroke="#e600ffff"
        d={pathGenerator2(routeShape)!}
      />
      <path
        fill="none"
        strokeWidth={2}
        stroke="#ff002bff"
        d={pathGenerator3(routeShape)!}
      />

      {projectedStops.map(([x, y]: any, i: number) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={4}
            fill="#0fbbeaff"
            stroke="#e3e3e3ff"
            strokeWidth={.7}
          />
          <text
            x={x - 15}
            y={y - 5}
            fontSize={8}
            fill="#afff7dff"
          >
            {routeStops[i].stop_id}
          </text>
        </g>
      ))}
    </svg>
  )
}
