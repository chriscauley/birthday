import { range } from 'lodash'

export const randomBday = (config) => {
  // A new person enters room, what is their birthday?
  const bday = Math.floor(Math.random() * config.days)
  return bday
}

export const simulateRoom = (config) => {
  // A room fills up with people until two have the same birthday
  const room = {}
  let i = 0
  while (i++ < config.days) {
    const new_bday = randomBday(config)
    if (room[new_bday]) {
      break
    }
    room[new_bday] = true
  }
  return { n_people: i, room }
}

export const simulateRooms = (config) => {
  // simulate a lot of rooms and count how many people are in each room until hash collision
  return range(config.n_rooms).map(() => simulateRoom(config).n_people)
}
