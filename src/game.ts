import { TextureFilter, TextureSampler } from 'blah'
import { Color } from 'blah'
import { Vec2, Mat3x2 } from 'blah'
import { App, batch } from 'blah'
import { Target } from 'blah'

import { World } from './world'
import { Collider } from './components/collider'

import { Batch } from 'blah'
import { Entity, Component } from './world'


class Logger extends Component {

  _prefix!: string

  render(batch: Batch) {
    console.log(this._prefix, this.entity.position)
  }
}

let world = new World()

let entity = world.add_entity(Vec2.make(0, 0))
let logger = entity.add(new Logger())
logger._prefix = 'hello'

console.log('first render')
world.render(batch)


class Player extends Component { render(batch: Batch) {} }
class Enemy extends Component { render(batch: Batch) {} }


let entity2 = world.add_entity(Vec2.make(0, 0))
let logger2 = entity2.add(new Logger())
logger2._prefix = 'logger 2'
let player = entity2.add(new Player())


let entity3 = world.add_entity(Vec2.make(0, 0))
let logger3 = entity3.add(new Logger())
logger3._prefix = 'logger 3'
let enemy = entity3.add(new Enemy())

console.log('second render')
world.render(batch)

let _player = world.first(Player)
if (_player) {
  _player.get(Logger)!._prefix = 'player logger'
}

console.log('third render')
world.render(batch)

export default class Game {

  width = 320
  height = 180

  buffer!: Target

  world: World = new World()

  load_room(cell: Vec2) {

    let offset = Vec2.make(cell.x * this.width, cell.y * this.height)

    let floor = this.world.add_entity(offset)
    floor.add(Collider.make_grid(8, 40, 23))

  }

  init() {

    this.buffer = Target.create(this.width, this.height)

    batch.default_sampler = TextureSampler.make(TextureFilter.Nearest)


    this.load_room(Vec2.make(0, 0))
  }

  update() {
  }

  render() {




    /* https://github.com/eguneys/p-editor#blah-sprite-batch-renders-to-the-canvas
    /*
    {

      App.backbuffer.clear(Color.black)

      batch.render(App.backbuffer)
      batch.clear()
    }
    return
    */


    {

      this.buffer.clear(Color.hex(0x150e22))


      let colliders = this.world.all(Collider)
      colliders.forEach(_ => _.render(batch))


      batch.render(this.buffer)
      batch.clear()
    }


    {
      let scale = Math.min(
        App.backbuffer.width / this.buffer.width,
        App.backbuffer.height / this.buffer.height)

        let screen_center = Vec2.make(App.backbuffer.width, App.backbuffer.height).scale(1/2)
        let buffer_center = Vec2.make(this.buffer.width, this.buffer.height).scale(1/2)

        App.backbuffer.clear(Color.black)
                                                  
        batch.push_matrix(Mat3x2.create_transform(screen_center, // position
                                                  buffer_center, // origin
                                                  Vec2.one.scale(scale), // scale
                                                  0                      // rotation
                                                 ))

        batch.tex(this.buffer.texture(0), Vec2.zero, Color.white)
        batch.pop_matrix()
        batch.render(App.backbuffer)
        batch.clear()
    }
  }

}
