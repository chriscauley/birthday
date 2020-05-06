import React from 'react'
import { isEqual, debounce } from 'lodash'
import Form from '@unrest/react-jsonschema-form'
import globalHook from 'use-global-hook'

const actions = {
  setInitial: (store, initial) => {
    if (!isEqual(store.state.initial, initial)) {
      store.setState({ initial, formData: initial })
    }
  },
  setState: (store, state) => store.setState(state),
}

const makeHook = globalHook(React, {}, actions)

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

export const Sidebar = withConfig((props) => {
  const { formData, initial, setState, setInitial } = props.config
  const onChange = debounce((formData) => setState({ formData }), 1000)
  setInitial({
    days: 365,
    n_rooms: 50000,
    x_range: 75,
  })
  return (
    <Form
      initial={initial}
      uiSchema={uiSchema}
      formData={formData}
      onChange={onChange}
      schema={schema}
      customButton={true}
    />
  )
})
