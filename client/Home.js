import React from 'react'
import { VictoryBar, VictoryChart } from 'victory'
import * as math from './math'

export default function Home() {
  const data = math.simulation(math.config)
  return (
    <div>
      <VictoryChart>
        <VictoryBar
          data={data}
          // data accessor for x values
          ax="quarter"
          // data accessor for y values
          ay="earnings"
          y="fraction_of_rooms"
          x="day_of_year"
        />
      </VictoryChart>
    </div>
  )
}
