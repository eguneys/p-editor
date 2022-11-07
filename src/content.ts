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

export type AsetFrameInfo = {
  name: string,
  packeds: Array<number>,
  frame: Array<number>,
  slices: Array<{}>
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



    let tilesets = content_page0_json.filter(_ => _.folder === './content/tilesets')
    .map((_: AsetFrameInfo) => {
      
      let tiles: Array<Subtexture> = []

      let name = _.name


      let [px, py, pw, ph] = _.packeds

      let columns = pw / Game.tile_width
      let rows = ph / Game.tile_height

      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          let subrect = Rect.make(px + x * Game.tile_width, py + y * Game.tile_height, Game.tile_width, Game.tile_height)

          let subtex = Subtexture.make(texture, subrect)

          tiles.push(subtex)
        }
      }

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
