import React from 'react'
import { withConfig } from './Sidebar'
import simulations from './simulations'
import Histogram from './Histogram'

export default withConfig(function Home(props) {
  const { params } = props.match
  const simulation =
    simulations.find((s) => s.key === params.simulation_number) ||
    simulations[0]
  const { results = [], setSimulation } = props.config
  setSimulation(simulation)
  return (
    <div className="home">
      {simulation.render(simulation, props.config.results)}
      {results.length > 0 && (
        <Histogram
          values={results}
          x_label="number_of_people"
          y_label="count"
        />
      )}
    </div>
  )
})
