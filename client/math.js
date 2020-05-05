import { range } from 'lodash'

export const config = {
  days: 365,
  n_rooms: 50000,
  x_range: 75,
}

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

export const simulation = (config) => {
  // simulate a lot of rooms and count how many people are in each room until hash collision
  const number_of_people = range(config.days).map(() => 0)
  range(config.n_rooms).forEach(() => {
    const people_until_match = simulateRoom(config).n_people
    range(people_until_match, config.days).forEach((i) => number_of_people[i]++)
  })
  const data = number_of_people.map((number_of_rooms, day_of_year) => {
    return {
      number_of_rooms,
      day_of_year,
      fraction_of_rooms: number_of_rooms / config.n_rooms,
    }
  })
  return data.slice(0, config.x_range)
}
