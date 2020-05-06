import React from 'react'
import { range } from 'lodash'
import { VictoryBar, VictoryChart } from 'victory'
import slugify from 'slugify'

import * as math from './math'

const Calendar = (props) => {
  const { data = {} } = props
  const { room = {} } = data
  const days = range(1, props.days + 1)

  return (
    <div className="flex flex-wrap calendar">
      {days.map((d) => (
        <div
          className={`day border h-16 p-1 text-right ${
            d === data.done ? 'matched' : ''
          }`}
          key={d}
        >
          {d}
          {room[d] && (
            <div className="text-center text-3xl">
              <i className="fa fa-user" />
              {d === data.done && <i className="fa fa-user" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const steps = []
export default steps

const Step = (step) => {
  steps.push(step)
  step.key = `${steps.length}-${slugify(step.title)}`
  step.past_runs = []
  return step
}

Step({
  title: 'Same Day of Month',
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
  render(simulation, _store) {
    return (
      <>
        <p>
          If there are N people in a room and two have the same birthday, is
          that unlikely?
        </p>
        <p>
          To simulate this we have a room with one person entering at a time.
          When two people have the same birth day, the simulation has ended. For
          simplicity we will first look at the odds of being born on the same
          day of month (30 possible birthdays).
        </p>
        <Calendar days={30} data={simulation.data} />
        {simulation.data && (
          <div>
            <div>
              People in room: {Object.keys(simulation.data.room).length}
            </div>
            <div>
              Birthday collision: {simulation.data.done ? 'Yes!' : 'No'}
            </div>
          </div>
        )}
      </>
    )
  },
})

Step({
  title: 'Day of Year Collision Probability',
  schema: {
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
  },
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
  render(simulation, _store) {
    if (!simulation.data || !simulation.data.results) {
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
  },
})
