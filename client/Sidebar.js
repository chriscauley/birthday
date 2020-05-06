import React from 'react'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'
import Form from '@unrest/react-jsonschema-form'
import globalHook from 'use-global-hook'

import simulations from './simulations'

let timeout

const actions = {
  setSimulation: (store, simulation) => {
    if (store.state.simulation.key !== simulation.key) {
      setTimeout(() =>
        store.setState({
          simulation,
          formData: simulation.initial,
          metaSettings: simulation.metaInitial,
        }),
      )
    }
  },
  setState: (store, state) => {
    store.setState(state)
    state.formData && store.actions.simulate()
  },
  runSimulation: (store) => {
    const { simulation } = store.state
    if (simulation.data && simulation.data.done) {
      simulation.past_runs.push(simulation.data)
    }
    simulation.data = simulation.reset(simulation.data || {})
    simulation.data.step = 0
    store.setState({ simulation })
    store.actions.step()
  },
  step: (store) => {
    const { step, data, finish = () => {} } = store.state.simulation
    step(data, store.state.formData)
    store.setState({ step })
    if (data.done) {
      finish(store.state.simulation)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(
        store.actions.step,
        store.state.metaSettings.step_delay,
      )
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
  step_delay: {
    'ui:widget': 'range',
  },
}

export const Sidebar = withRouter(
  withConfig((props) => {
    const {
      formData,
      metaSettings,
      simulation,
      setState,
      runSimulation,
    } = props.config
    if (!simulation) {
      return null
    }
    const { schema, metaSchema } = simulation
    const dropdown_links = simulations.map((s) => ({
      children: s.title,
      to: `/${s.key}/`,
    }))
    return (
      <div>
        <Dropdown links={dropdown_links}>{simulation.title}</Dropdown>
        <div className="border-b m-4" />
        {schema && (
          <Form
            uiSchema={uiSchema}
            formData={formData}
            onChange={(formData) => setState({ formData })}
            schema={schema}
            customButton={true}
          />
        )}
        {metaSchema && (
          <Form
            uiSchema={uiSchema}
            formData={metaSettings}
            onChange={(metaSettings) => setState({ metaSettings })}
            schema={metaSchema}
            customButton={true}
          />
        )}
        {simulation.reset && (
          <button onClick={runSimulation} className={css.button()}>
            Run Simulation
          </button>
        )}
      </div>
    )
  }),
)
