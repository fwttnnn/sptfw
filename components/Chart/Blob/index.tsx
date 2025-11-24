import * as d3 from "d3"

export type Args = {
  data: {[category: number | string]: {[sub: number | string]: number}},
  size?: number,
  width?: number,
  height?: number,
}

export default ({ data, size = 40, width = 500, height = 400 }: Args) => {
  const catg = Object.keys(data)
  const subg = Object.keys(data[catg[0]])

  const r = d3.scaleLinear()
    .domain([0, d3.max(catg.flatMap((c) => subg.map((s) => data[c][s]))) || 1]) // avoid 0 max
    .range([0, size])

  const x0 = d3
    .scaleBand()
    .domain(catg)
    .range([0, width])
    .paddingInner(0.05)
    .paddingOuter(0.05)
    .round(true)
  
  const x1 = d3
    .scaleBand()
    .domain(subg)
    .range([0, x0.bandwidth()])
    .padding(0.005)
    .round(true)
  
  return (
    <svg width={width} height={height}>
      <g
        fill="none"
        transform={`translate(0,${height / 2})`}
      >
        <line
          fill="none"
          stroke="currentColor"
          x1={0}
          y1={0}
          x2={width}
          y2={0}
        />

        {catg.map((c) => (
          <g
            key={`-:g-${c}`}
            transform={`translate(${x0(c)},0)`}
          >
            {subg.map((s) => (
              <circle
                key={`-:circle-${c}-${s}`}
                cx={x1(s)! + (x1.bandwidth() / 2)}
                cy={0}
                r={r(data[c][s])}
                fill="rgba(255,255,255,0.5)"
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}
