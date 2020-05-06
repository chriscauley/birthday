import React from 'react'
import { range } from 'lodash'
import { VictoryBar, VictoryChart } from 'victory'

import { withConfig } from './Sidebar'
import * as math from './math'

const style = {
  width: 100 / 7 + '%',
}

const Calendar = (props) => {
  const { data = {} } = props
  const { room = {} } = data
  const days = range(1, props.days + 1)
  return (
    <div className="flex flex-wrap">
      {days.map((d) => (
        <div className="border h-16 p-2 relative" style={style} key={d}>
          {d}
          {room[d] && (
            <div className="absolute">
              <i className="fa fa-user" />
              {d === data.done && <i className="fa fa-user text-red-500" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const Step1 = withConfig((props) => {
  const { setSimulation, simulation } = props.config
  setSimulation({
    key: 1,
    reset: () => ({ room: {} }),
    step: (data) => {
      const new_day = math.randomBday({ days: 30 })
      if (data.room[new_day]) {
        data.done = new_day
        return
      }
      data.step++
      data.room[new_day] = data.step
    },
  })
  if (!simulation) {
    return null
  }
  return <Calendar days={30} data={simulation.data} />
})

export const Step2 = withConfig((props) => {
  const { setSimulation, simulation } = props.config
  const schema = {
    type: 'object',
    properties: {
      days: {
        type: 'integer',
        minimum: 15,
        maximum: 365,
      },
      n_rooms: { type: 'integer' },
      x_range: { type: 'integer' },
    },
  }
  setSimulation({
    key: 1,
    schema,
    reset: () => ({}),
    initial: {
      days: 365,
      n_rooms: 3000,
      x_range: 50,
    },
    step: (data, formData) => {
      data.results = math.simulation(formData)
      data.done = true
    },
  })
  if (!simulation || !simulation.data) {
    return null
  }
  return (
    <div>
      <VictoryChart>
        <VictoryBar
          data={simulation.data.results}
          y="fraction_of_rooms"
          x="day_of_year"
        />
      </VictoryChart>
    </div>
  )
})

export default withConfig(function Home(props) {
  const { formData } = props.config
  if (!formData) {
    return null
  }
})
