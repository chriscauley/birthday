import React from 'react'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import { Dropdown } from '@unrest/core'
import storage, { keyring } from './storage'
import css from '@unrest/css'
import Form from '@unrest/react-jsonschema-form'
import globalHook from 'use-global-hook'

import simulations from './simulations'

let timeout

const actions = {
  setSimulation: (store, simulation) => {
    if (store.state.simulation.key !== simulation.key) {
      const configData =
        storage.get(keyring.configData(simulation)) || simulation.initial
      setTimeout(() =>
        store.setState({
          simulation,
          configData,
          metaData:
            storage.get(keyring.metaData(simulation)) || simulation.metaInitial,
          results: storage.get(keyring.results(simulation, configData)) || [],
        }),
      )
    }
  },
  setState: (store, new_state) => {
    store.setState(new_state)

    // save setting in local storage for reloading
    Object.entries(new_state).forEach(([key, value]) => {
      if (keyring[key]) {
        const storage_key = keyring[key](
          store.state.simulation,
          new_state.configData || store.state.configData,
        )
        storage.set(storage_key, value)
      }
    })

    // TODO this should be auto run or something
    // start simulation if it has configData
    new_state.configData && store.actions.simulate()
  },
  runSimulation: (store) => {
    const { simulation } = store.state
    if (simulation.data && simulation.data.done) {
      simulation.past_runs.push(simulation.data)
    }
    simulation.data = simulation.reset()
    simulation.data.step = 0
    store.setState({ simulation })
    store.actions.step()
  },
  step: (store) => {
    const { step, data, finish = () => {} } = store.state.simulation
    step(data, store.state.configData)
    store.setState({ step })
    if (data.done) {
      const { results } = store.state
      finish(store.state.simulation, results)
      store.actions.setState({ results })
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(store.actions.step, store.state.metaData.step_delay)
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
      configData,
      metaData,
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
            formData={configData}
            onChange={(configData) => setState({ configData })}
            schema={schema}
            customButton={true}
          />
        )}
        {metaSchema && (
          <Form
            uiSchema={uiSchema}
            formData={metaData}
            onChange={(metaData) => setState({ metaData })}
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
