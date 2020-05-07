import React from 'react'
import { range, max } from 'lodash'
import { VictoryBar, VictoryChart } from 'victory'

export default function Histogram({
  values,
  x_label,
  y_label,
  normalized = false,
}) {
  const data = {
    x_max: max(values),
    x_min: 0, // Math.min(...values),
  }
  data.counts = range(data.x_max + 1).map(() => 0)
  values.forEach((v) => data.counts[v]++)
  data.y_max = max(data.counts)
  const y_cumulative_label = y_label + '__cumulative'
  let cumulative = 0
  data.results = data.counts.map((y, x) => {
    if (x < data.x_min) {
      return
    }
    if (normalized) {
      y = y / data.y_max
    }
    cumulative += y
    return { [y_label]: y, [x_label]: x, [y_cumulative_label]: cumulative }
  })
  return (
    <div className="flex">
      <VictoryChart>
        <VictoryBar data={data.results} y={y_label} x={x_label} />
      </VictoryChart>
      <VictoryChart>
        <VictoryBar data={data.results} y={y_cumulative_label} x={x_label} />
      </VictoryChart>
    </div>
  )
}
