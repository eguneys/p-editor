import { ticks, v_screen } from './shared'
import { AllPlays, WithPlays } from './play'
import { make_drag } from './drag'
import { Vec2 } from './vec2'
import { appr, lerp } from './lerp'

class Background extends WithPlays {

  _scale!: number
  _t_scale!: number

  _pan!: Vec2
  _t_pan!: Vec2

  _pan_begin?: Vec2

  _init() {

    this._scale = 1
    this._t_scale = 1

    this._pan = Vec2.zero
    this._t_pan = Vec2.zero

    let _self = this

    make_drag({
      on_drag(e, e0) {

        if (e.m) {
          let _o = _self.ref.get_normal_at_abs_pos(e.e).mul(v_screen)
          let o = _self.ref.get_normal_at_abs_pos(e.m).mul(v_screen)

          if (!_self._pan_begin) {
            _self._pan_begin = o.sub(_self._pan)
          } else {
            _self._t_pan = o.sub(_self._pan_begin)

            _self._t_pan.x = Math.max(1000 + -6900 * _self._t_scale, 
                                      Math.min(1500, _self._t_pan.x))
            _self._t_pan.y = Math.max(500 + -3200 * _self._t_scale, 
                                      Math.min(1000, _self._t_pan.y))
          }
        }
      },
      on_wheel(_: number) {
        _self._t_scale += -_ * 0.1

        _self._t_scale = Math.max(0.25, Math.min(2.5, _self._t_scale))
      },
      on_up() {
        _self._pan_begin = undefined
      }
    }, this.$element)
  }

  _update(dt: number) {
    this._scale = appr(this._scale, this._t_scale, dt * 4)


    this._pan.x = lerp(this._pan.x, this._t_pan.x, 0.8)
    this._pan.y = lerp(this._pan.y, this._t_pan.y, 0.8)

  }

  _draw() {

    this.gtexture(1920/2, 1080/2, 1920, 1080, 24, 8, 8, 8)

    let { x, y }  = this._pan
    let r = 40 * this._scale
    for (let i = 0; i < 160; i++) {
      for (let j = 0; j < 90; j++) {
        if ((i + j) % 2 === 0) {
          this.gtexture(x + i * r, y + j * r, r, r, 0, 8, 8, 8)
        } else {
          this.gtexture(x + i * r, y + j * r, r, r, 8, 8, 8, 8)
        }
      }
    }

  }
}

export default class App extends AllPlays {

  _init() {
    this.make(Background)
  }
}
