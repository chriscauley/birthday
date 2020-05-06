import React from 'react'
import css from '@unrest/css'

import { withConfig } from './Sidebar'
import steps from './steps'

export default withConfig(function Home(props) {
  const simulation = steps.find((s) => s.key === props.match.params.step_number)
  if (!simulation) {
    return (
      <div>
        <div>Choose a step to begin</div>
        {steps.map((step) => (
          <div key={step.key}>
            <a href={`/${step.key}/`} className={css.link()}>
              {step.title}
            </a>
          </div>
        ))}
      </div>
    )
  }
  props.config.setSimulation(simulation)
  return <div className="w-2/3 home">{simulation.render(simulation)}</div>
})
