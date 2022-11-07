import Game from './game'
import { Rect, Vec2, Image as BImage } from 'blah'
import { Texture, Subtexture } from 'blah'
/* https://vitejs.dev/guide/features.html#glob-import-as */
const content_map = import.meta.glob('../content/map/*.png', { import: 'default' })

import { Tileset } from './assets/tileset'

import content_page0 from '../content/out_0.png'
import content_page0_json from '../content/out_0.json'


function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}


export type RoomInfo = {
  image: BImage,
  cell: Vec2
}

class Content {

  load = async () => {

    let _rooms = []
    for (const path in content_map) {
      _rooms.push(content_map[path]().then(_ => load_image(_ as string)).then(_ => [path, _] as [string, HTMLImageElement]))
    }

    let rooms = (await Promise.all(_rooms)).map(([path, image]) => {

      let name = path.split('/').slice(-1)[0].split('.')[0]
      let point = name.split('x')

      let cell = Vec2.make(parseInt(point[0]), parseInt(point[1]))


      return {
        cell,
        image: BImage.make(image)
      }

    })


    let image = await load_image(content_page0)
    let texture = Texture.from_image(image)



    let tilesets = content_page0_json.tilesets.map(_ => {
      
      let name = _.name

      let tiles = _.packs.map(_ => {
        let framerect = Rect.make(_.frame.x, _.frame.y, _.frame.w, _.frame.h)

        let subrect = Rect.make(_.packed.x, _.packed.y, _.packed.w, _.packed.h)


        return Subtexture.make(texture, subrect, framerect)
      })

      return new Tileset(name,
                         tiles)
    })

    this.rooms = rooms
    this.tilesets = tilesets
  }


  rooms!: Array<RoomInfo>
  tilesets!: Array<Tileset>


  find_room(cell: Vec2) {
    return this.rooms.find(_ => _.cell.equals(cell))!.image
  }


  find_tileset(name: string) {
    return this.tilesets.find(_ => _.name === name)!
  }
}


export default new Content()
