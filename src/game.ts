import { TextureFilter, TextureSampler } from 'blah'
import { Color } from 'blah'
import { Vec2, Mat3x2 } from 'blah'
import { App, batch } from 'blah'
import { Target } from 'blah'

import { World } from './world'
import { Collider } from './components/collider'

new World()

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
