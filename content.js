import fs from 'fs'
import chokidar from 'chokidar'

const enum_content_map = () => {
  fs.readdir('./content/map', (err, files) => {
    let _ = files.filter(_ => _.match('.*\.png'))
    fs.writeFile('./content/map/enum.json', JSON.stringify(_), (err) => {
      if (!err) {
        console.log(`./content/map changed ${_.length} files`)
      }
    })
  })
}


chokidar.watch('./content/map/*.png', { ignoreInitial: true })
  .on('all', (event, path) => enum_content_map())

enum_content_map()
