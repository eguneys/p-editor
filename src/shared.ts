import { Vec2 } from './vec2'

export const w = 1920
export const h = 1080

export const v_screen = Vec2.make(w, h)

const rate = 1000 / 60
export const ticks = {
  seconds: 60 * rate,
  half: 30 * rate,
  thirds: 20 * rate,
  lengths: 15 * rate,
  sixth: 10 * rate,
  five: 5 * rate,
  three: 3 * rate,
  one: 1 * rate
}
