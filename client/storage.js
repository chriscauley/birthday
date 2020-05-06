import Storage from '@unrest/storage'

export default new Storage()

const hash = (obj = {}) => {
  let out = ''
  Object.entries(obj).forEach((entry) => {
    out += '&' + entry.join('=')
  })
  return out
}
export const keyring = {
  configData: ({ id }) => id + '__config',
  metaData: ({ id }) => id + '__meta',
  results: ({ id }, configData) => id + '__results' + hash(configData),
}
