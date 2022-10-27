export const loop = (_fn: (dt: number) => void) => {
  let _cancel: number
  let _last_now = 0

  function step(_now: number) {
    let dt = _now - (_last_now || _now)
    _last_now = _now
    dt = Math.max(Math.min(dt, 16), 4)
    _fn(dt / 1000)
    _cancel = requestAnimationFrame(step)
  }
  _cancel = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(_cancel)
  }
}


