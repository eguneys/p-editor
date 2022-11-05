## Import all png files in a directory with Vite

We have two types of content, PNG `.png` files and Aseprite `.ase` files. The transition between editing content on Aseprite and seeing the result on the browser should be smooth.

My initial attempt was described at [Content.md](Content.md), then I found a better way as described here.

`content/map` directory contains the map data of each room as `.png` files. We have to import all `.png` files in that directory and load them as images. Thankfully to Vite there is an easy way to import files as a glob:


`content.ts`
```ts
/* https://vitejs.dev/guide/features.html#glob-import-as */
const content_map = import.meta.glob('../content/map/*.png', { import: 'default' })

```

We dynamically import all png files in `content/map`. It returns the names of the png files as promises, we also have to load the images as well:

`content.ts`
```ts
function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}

```

The filenames of png files in `content/map` has the format `0x0` where the numbers are the x and y coordinates of the room. Like `0x0` and `1x0` are rooms next to each other. Each room has a size of 30x17.

`content.ts`
```ts
import { Vec2, Image as BImage } from 'blah'

/* ... */

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

```


`Image` we import as `BImage` from `'blah'` represents an Image in memory, where we can get the pixels as `Color` which is also imported from `'blah'`.

Finally we use top level await keyword which imports the module after loading all the images so we don't deal with async loading.
