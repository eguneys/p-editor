## Enumerate directory, reload content on change

We have two types of content, PNG `.png` files and Aseprite `.ase` files. The transition between editing content on Aseprite and seeing the result on the browser should be smooth.

Make a directory `content/map` and add a png file in that folder. We will watch changes to `png` files in this folder.

`pnpm add chokidar -D` , this dev dependency will watch our content directory.

Make a `content.js` script file at the project root folder:

`content.js`
```js
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
```

This script will watch for changes in `./content/map/*.png` and write an `enum.json` file in that folder that contains an array of all the `.png` file names.

Add an npm script at package json to call this script:

`package.json`
```js
  /* ... */
  "scripts" : {
   /* ... */
    "content": "node content.js"
  }
```

Run `pnpm content` and view the file `./content/map/enum.json`, see it has all the png files in that directory. Note that when you add a new `.png` file, it updates the `enum.json`.

We want to run this along `pnpm dev` so add another dependency that will run both scripts concurrently: `pnpm add concurrently -D`.

`package.json`
```js
   /* ... */
   "scripts": {
     "devc": "concurrently \"pnpm dev\" \"pnpm content\"",
   /* ... */
```

Instead of `pnpm dev` run `pnpm devc` to run both scripts in parallel.

To test this out, import and log the contents of `enum.json`:

`game.ts`
```js
import content_map from '../content/map/enum.json'
console.log(content_map)
```

Make changes to a `.png` file in our watched folder, or add another `.png` file, and see the browser reload, and log contents of `enum.json`.


Later we will use the same technique to watch for `.ase` files in `content` folder, it is left as an exercise to the reader. See also [content.js](content.js).
