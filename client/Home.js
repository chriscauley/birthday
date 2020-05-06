import React from 'react'
import { VictoryBar, VictoryChart } from 'victory'

import { withConfig } from './Sidebar'
import * as math from './math'

export default withConfig(function Home(props) {
  const { formData } = props.config
  const data = math.simulation(formData)
  return (
    <div>
      <VictoryChart>
        <VictoryBar data={data} y="fraction_of_rooms" x="day_of_year" />
      </VictoryChart>
    </div>
  )
})
