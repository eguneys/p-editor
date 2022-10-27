import { w, h } from './shared'
import sprites_png from '../assets/sprites.png'
import { Camera, Canvas, Graphics, Batcher } from './webgl'
import { Vec3 } from './webgl/math4'
import App from './editor'



const app = (element: HTMLElement, images: Array<HTMLImageElement>) => {

  let c = new Camera(Vec3.zero, Vec3.zero)

  let canvas = new Canvas(element, w, h)
  let graphics = new Graphics(canvas, c)

  let g = new Batcher(graphics)

  let _ctx = {
    c,
    g,
    element
  }

  let p = new App(_ctx).init()
  g.init(0x000000, images)

  loop(dt => {
    p.update(dt)
    p.draw()
    g.render()
  })
}

function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}


export const loop = (_fn: (dt: number) => void) => {
  let _cancel: number
  let _last_now = 0

  function step(_now: number) {
    let dt = _now - (_last_now || _now)
    _last_now = _now
    dt = Math.max(Math.min(dt, 16), 4)
    _fn(dt)
    _cancel = requestAnimationFrame(step)
  }
  _cancel = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(_cancel)
  }
}

Promise.all([
  load_image(sprites_png),
  load_image(sprites_png),
  load_image(sprites_png)
]).then(images => app(document.getElementById('app')!, images))

export {}
