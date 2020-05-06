import React from 'react'
import { Link } from 'react-router-dom'
import { range } from 'lodash'
import { VictoryBar, VictoryChart } from 'victory'
import slugify from 'slugify'
import css from '@unrest/css'
import classnames from 'classnames'

import * as math from './math'

const MonthCalendar = (props) => {
  const { data = {}, offset = 0, className } = props
  const { room = {}, done } = data
  const days = range(1, props.days + 1)

  return (
    <div className={classnames('calendar', className)}>
      {range(offset).map((i) => (
        <div key={i} className="day opacity-0" />
      ))}
      {days.map((d) => (
        <div className={classnames('day', { matched: d === done })} key={d}>
          <span className="number">{d}</span>
          {room[d] && (
            <div className="people">
              <i className="fa fa-user" />
              {d === data.done && <i className="fa fa-user" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const simulations = []
export default simulations

const getMetaOptions = () => {
  return {
    metaSchema: {
      type: 'object',
      properties: {
        step_delay: {
          title: 'Step Delay (ms)',
          type: 'integer',
          minimum: 0,
          maximum: 1000,
          multipleOf: 100,
        },
      },
    },
    metaInitial: { step_delay: 0 },
  }
}

const Simulation = (simulation) => {
  simulation.id = simulations.length
  simulation.title = `${simulation.id}. ${simulation.title}`
  simulation.key = slugify(`${simulation.id} ${simulation.title}`)
  simulation.past_runs = []
  simulations.push(simulation)
  return simulation
}

Simulation({
  title: 'Introduction',
  render() {
    return (
      <div>
        <div>Choose a simulation to begin</div>
        {simulations.slice(1).map((simulation) => (
          <div key={simulation.key}>
            <Link to={`/${simulation.key}/`} className={css.link()}>
              {simulation.title}
            </Link>
          </div>
        ))}
      </div>
    )
  },
})

Simulation({
  title: 'Same Day of Month',
  reset: () => ({ room: {} }),
  finish: (simulation, results) => {
    // people in room is one more than room length (since one spot is double occupied)
    results.push(Object.keys(simulation.data.room).length + 1)
  },
  step: (data) => {
    const new_day = math.randomBday({ days: 30 })
    if (data.room[new_day]) {
      data.done = new_day
      return
    }
    data.step++
    data.room[new_day] = data.step
  },
  ...getMetaOptions(),
  render(simulation, results = []) {
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
        <MonthCalendar days={30} data={simulation.data} offset={2} />
        {simulation.data && (
          <div>
            <div>
              People in room: {Object.keys(simulation.data.room).length + 1}
            </div>
            <div>
              Birthday collision: {simulation.data.done ? 'Yes!' : 'No'}
            </div>
          </div>
        )}
        {results.length > 0 && (
          <Histogram
            values={results}
            x_label="number_of_people"
            y_label="count"
          />
        )}
      </>
    )
  },
})

const Histogram = ({ values, x_label, y_label, normalized = false }) => {
  const data = {
    x_max: Math.max(...values),
    x_min: 0, // Math.min(...values),
  }
  data.counts = range(data.x_max + 1).map(() => 0)
  values.forEach((v) => data.counts[v]++)
  data.y_max = Math.max(...data.counts)
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

Simulation({
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
  initial: {
    days: 365,
    n_rooms: 3000,
    x_range: 50,
  },
  ...getMetaOptions(),
  reset: () => ({}),
  step: (data, configData) => {
    data.results = math.simulation(configData)
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
