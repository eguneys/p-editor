import { Vec2, Image as BImage } from 'blah'
/* https://vitejs.dev/guide/features.html#glob-import-as */
const content_map = import.meta.glob('../content/map/*.png', { import: 'default' })

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

  static load = async () => {

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

    return new Content(rooms)
  }


  constructor(readonly rooms: Array<RoomInfo>) {
  }

  find_room(cell: Vec2) {
    return this.rooms.find(_ => _.cell.equals(cell))!.image
  }
}


export default await Content.load()
