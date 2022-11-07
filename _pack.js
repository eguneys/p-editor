import fs from 'fs'
import { ImageSave, Rect, Packer, aseprite } from 'aset'

export default async function pack() {

  let packer = new Packer()

  let tilesets = []

  await ase_files('./content/tilesets')
    .then(_ => _.map(({name, ase}) => {

      let packs = []

      let frame = ase.frames[0]
      let columns = frame.image.width / 8
      let rows = frame.image.height / 8

      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          let subrect = Rect.make(x * 8, y * 8, 8, 8)
          let subimage = new ImageSave(frame.image).get_sub_image(subrect)
          let pack = packer.add(subimage.image)

          packs.push(pack)
        }
      }

      tilesets.push({ name, packs })
    }))


  packer.pack()


  tilesets = tilesets.map(({ name, packs }) => ({
    name,
    packs: packs.map(_ => ({ frame: _.frame, packed: _.packed }))
  }))

  let res = {
    tilesets
  }

  fs.writeFileSync('./content/out_0.json', JSON.stringify(res))
  fs.writeFileSync('./content/out_0.png', packer.pages[0].png_buffer)

  console.log('content written.')

}


function ase_files(folder) {
  return new Promise(resolve => {
    fs.readdir(folder, (err, files) => {
      Promise.all(files.filter(_ => _.match(/\.ase$/))
        .map(file => new Promise(_resolve => {
          fs.readFile([folder, file].join('/'), (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            let name = file.split('.')[0]
            _resolve({ name, ase: aseprite(data)})
          })
        }))).then(resolve)

    })
  })
}
