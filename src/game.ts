import { TextureFilter, TextureSampler } from 'blah'
import { Color } from 'blah'
import { Vec2, Mat3x2 } from 'blah'
import { App, batch } from 'blah'
import { Target } from 'blah'

import { World } from './world'
import { Collider } from './components/collider'
import { Tilemap  } from './components/tilemap'
import { Player } from './components/player'

import { Batch } from 'blah'
import { Entity, Component } from './world'

import Content from './content'

/*
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

*/

export default class Game {


  static rand_int = (min: number, max: number) => {
    return min + Math.floor(Math.random() * (max - min))
  }

  static width = 240
  static height = 135

  static tile_width = 8
  static tile_height = 8
  static columns = Math.floor(Game.width / Game.tile_width)
  static rows = Math.floor(Game.height / Game.tile_height + 1)

  buffer!: Target

  world: World = new World()

  load_room(cell: Vec2) {

    let grid = Content.find_room(cell)

    let offset = Vec2.make(cell.x * Game.width, cell.y * Game.height)


    let castle = Content.find_tileset('castle')
    let grass = Content.find_tileset('grass')
    let plants = Content.find_tileset('plants')
    let backs = Content.find_tileset('backs')

    let floor = this.world.add_entity(offset)
    let solids = floor.add(Collider.make_grid(8, 30, 17))

    let tilemap = floor.add(Tilemap.make(8, 8, Game.columns, Game.rows))

    for (let x = 0; x < Game.columns; x++) {
      for (let y = 0; y < Game.rows; y++) {

        let world_position = offset
        .add(Vec2.make(x * Game.tile_width, y * Game.tile_height))
        .add(Vec2.make(Game.tile_width / 2, Game.tile_height))

        let col = grid.pixels[x + y * Game.columns]

        switch (col.rgb) {
          case 0x000000:
            break;
          case 0xfff1e8:
            tilemap.set_cell(x, y, castle.random_tile)
            solids.set_cell(x, y, true)
          break
          case 0x00e436:
            tilemap.set_cell(x, y, grass.random_tile)
            solids.set_cell(x, y, true)
            break
          case 0x008751:
            tilemap.set_cell(x, y, plants.random_tile)
            break
          case 0xff9d81:

            tilemap.set_cell(x, y, backs.random_tile)
            break
          case 0x29adff: {
            if (!this.world.first(Player)) {
              Player.make(this.world, world_position.add(Vec2.make(0, -16)))
            }
          }
            break
        }


      }
    }

  }

  init() {

    this.buffer = Target.create(Game.width, Game.height)

    batch.default_sampler = TextureSampler.make(TextureFilter.Nearest)


    Content.load().then(() => {
      this.load_room(Vec2.make(0, 0))
    })
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

      this.world.render(batch)

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
