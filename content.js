import fs from 'fs'
import chokidar from 'chokidar'
import aset from 'aset'

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

const ase_content_tiles = () => {
  aset(['./content/tilesets'], './content/out')
}


/*
chokidar.watch('./content/map/*.png', { ignoreInitial: true })
  .on('all', (event, path) => enum_content_map())
*/

chokidar.watch('./content/tilesets/*.ase', { ignoreInitial: true })
  .on('all', (event, path) => ase_content_tiles())

enum_content_map()
