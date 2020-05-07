import { pick } from 'lodash'

const configProperties = {
  days: {
    type: 'integer',
    minimum: 15,
    maximum: 365,
    default: 30,
  },
  n_rooms: {
    type: 'integer',
    default: 5000,
  },
}

export const getConfigSchema = (
  properties = Object.keys(configProperties),
) => ({
  type: 'object',
  properties: pick(configProperties, properties),
})

const metaProperties = {
  step_delay: {
    title: 'Step Delay (ms)',
    type: 'integer',
    minimum: 0,
    maximum: 1000,
    multipleOf: 100,
    default: 1000,
  },
}

export const getMetaSchema = (properties = Object.keys(metaProperties)) => ({
  type: 'object',
  properties: pick(metaProperties, properties),
})

export default {
  config: {
    get: getConfigSchema,
  },
  meta: {
    get: getMetaSchema,
  },
}
