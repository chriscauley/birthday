import React from 'react'

import { withConfig } from './Sidebar'
import simulations from './simulations'

export default withConfig(function Home(props) {
  const { params } = props.match
  const simulation =
    simulations.find((s) => s.key === params.simulation_number) ||
    simulations[0]
  props.config.setSimulation(simulation)
  return <div className="home">{simulation.render(simulation)}</div>
})
