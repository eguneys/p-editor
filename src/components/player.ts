import { Vec2, Color, Rect, Mat3x2 } from 'blah'
import { Batch } from 'blah'
import { World, Component } from '../world'
import { Animator } from './animator'

export class Player extends Component {


  static make = (world: World, position: Vec2) => {

    let entity = world.add_entity(position)
    let anim = entity.add(Animator.make('player'))
    anim.play('idle')

    entity.add(new Player())

    return entity
  }
}

