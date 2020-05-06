import React from 'react'
import css from '@unrest/css'

import { withConfig } from './Sidebar'
import simulations from './simulations'

export default withConfig(function Home(props) {
  const simulation = simulations.find((s) => s.key === props.match.params.simulation_number)
  if (!simulation) {
    return (
      <div>
        <div>Choose a simulation to begin</div>
        {simulations.map((simulation) => (
          <div key={simulation.key}>
            <a href={`/${simulation.key}/`} className={css.link()}>
              {simulation.title}
            </a>
          </div>
        ))}
      </div>
    )
  }
  props.config.setSimulation(simulation)
  return <div className="home">{simulation.render(simulation)}</div>
})
