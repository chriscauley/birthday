import React from 'react'
import { debounce } from 'lodash'
import Form from '@unrest/react-jsonschema-form'
import globalHook from 'use-global-hook'

let simulation
let timeout

const step_time = 1000

const actions = {
  setSimulation: (store, simulation) => {
    if (store.state.simulation.key !== simulation.key) {
      setTimeout(() =>
        store.setState({ simulation, formData: simulation.initial }),
      )
    }
  },
  setState: (store, state) => {
    store.setState(state)
    store.actions.simulate()
  },
  runSimulation: (store) => {
    const { simulation } = store.state
    simulation.data = simulation.reset()
    simulation.data.step = 0
    store.setState({ simulation })
    store.actions.step()
  },
  step: (store) => {
    const { step, data } = store.state.simulation
    step(data, store.state.formData)
    store.setState(simulation)
    if (!data.done) {
      clearTimeout(timeout)
      timeout = setTimeout(store.actions.step, step_time)
    }
  },
  simulate: debounce((store) => {
    store.actions.runSimulation()
  }),
}

const makeHook = globalHook(React, { simulation: {} }, actions)

export const withConfig = (Component) => {
  return function ConfigProvider(props) {
    const [state, actions] = makeHook()
    const config = {
      ...state,
      ...actions,
    }
    return <Component config={config} {...props} />
  }
}

const uiSchema = {
  days: {
    'ui:widget': 'range',
  },
}

export const schema = {
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

export const Sidebar = withConfig((props) => {
  const { formData, simulation, setState, runSimulation } = props.config
  if (!simulation) {
    return null
  }
  const { schema, initial } = simulation
  const onChange = (formData) => setState({ formData })
  return (
    <div>
      {schema && (
        <Form
          initial={initial}
          uiSchema={uiSchema}
          formData={formData}
          onChange={onChange}
          schema={schema}
          customButton={true}
        />
      )}
      <button onClick={runSimulation}>Run Simulation</button>
    </div>
  )
})
