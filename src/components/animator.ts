import { Vec2, Color, Rect, Mat3x2 } from 'blah'
import { Batch } from 'blah'
import { World, Component } from '../world'
import Content from '../content'
import { Sprite } from '../assets/sprite'

export class Animator extends Component {

  static make = (name: string) => {
    let sprite = Content.find_sprite(name)
    return new Animator(sprite)
  }

  constructor(readonly sprite: Sprite) {
    super()
  }

  play(_: string) {
  }
}

