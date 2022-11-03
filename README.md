# Walkthrough of Tiny Link Game of Noel Berry

Noel Berry, creator of Celeste, has made a Zelda inspired platformer game on his [twitch stream](https://www.twitch.tv/noelfb) in 15 hours.

He used a C++ game framework called [blah](https://github.com/NoelFB/blah) that he wrote himself in about 6 months. It supports both OpenGL and DirectX, and works on Windows or SDL supported platforms.

The game uses a simple Entity Component architecture, a grid based map and colliders, and content like tilesets and animations loaded directly from Aseprite files. The "blah" framework uses sprite batching to draw textures, and methods to render primitive graphics for debugging purposes. Finally it has helpful vector and matrix classes to help with the math.

This is a walkthrough of his process in Typescript and WebGL. It uses the rewrite of the [blah framework in Typescript](https://github.com/eguneys/blah).

There is also a [walkthrough of PICO-8 version of Celeste](https://github.com/eguneys/celeste-jumping) written previously.

Currently Noel streams about his side project that is Megaman inspired metroidvania. It features 2D Platforming with slopes, handles collisions with Separating Axis Theorem, layered tiles, smooth room transitions like in Celeste, an awesome level editor, and enemy behaviour described using coroutines. These will be the topic of our next post.

Finally the internals of the rewrite of "blah" game framework in Typescript will also be discussed in a later post.


See [SETUP.md](SETUP.md) for how to setup the Typescript project and install the "blah in Typescript" dependency.
The full code can be found at this repository. And a demo of the final version can be found [here]().

## Specify Game config and append the Canvas to DOM

```js
import { App } from 'blah'
import Game from './game'

const app = (element: HTMLElement) => {

  let game = new Game()

  App.run({
    name: 'p-editor',
    width: 1920,
    height: 1080,
    on_startup() {
      game.init()
    },
    on_update() {
      game.update()
    },
    on_render() {
      game.render()
    }
  })

  if (App.canvas) {
    element.appendChild(App.canvas)
  }
}


app(document.getElementById('app')!)
```

We will implement the `Game` object next but here, we import `App` from `'blah'` and call `App.run` method with our config that specifies the canvas size, and a bunch of callbacks.

This creates a canvas, and stores the `webgl2` context for drawing, also creates a game loop using `requestAnimationFrame`. So `on_startup` get's called once on startup, `on_update` is called on each frame (possibly multiple times), and `on_render` is called on each frame last.

The canvas created is available via `App.canvas` which you can add to DOM as you wish. Also check out the DOM to see the canvas that has specified size in the config.

Optionally style the page by adding this to `<head>` section of `index.html`:

`index.html`

```html
<style>
html, body {
  padding: 0;
  margin: 0;
}

#app {
  margin: auto;
  position: relative;
  width: min(100vw, 100vh * 16/9);
  aspect-ratio: 16/9;
}

#app canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
    </style>

```


This will center the canvas on the page as it resize, scale it to fill the browser viewport, and keep a 16/9 aspect ratio. So the canvas size we will be working with is specified in the config we passed to `App.run` and different from the actual width and height of the canvas on the page. Finally we set `image-rendering: pixelated` to achieve a pixelated look.


## "blah" Sprite Batch renders to the Canvas

`game.ts`

```
import { Color } from 'blah'
import { App, batch } from 'blah'

export default class Game {
  init() {
  }
  update() {
  }
  render() {

    {
      App.backbuffer.clear(Color.black)

      batch.render(App.backbuffer)
      batch.clear()
    }

  }
}
```


`App.backbuffer` represents the screen. It's a `Target` that we can render to. `batch` is an object we call methods on to do the rendering. It's a `Sprite Batcher` that batches the render commands and renders at the end. 

So we call `App.backbuffer.clear` with a black color to clear the backbuffer. (That calls gl.clear)
Render the `App.backbuffer` target with the `batch`. And finally we have to call `batch.clear()` each time we render for maintenance.

See the black canvas rendered on the page.


## More Targets to render

`game.ts`
```
import { TextureFilter, TextureSampler } from 'blah'
import { Vec2, Mat3x2 } from 'blah'
import { Target } from 'blah'


/* export default class Game { */

  width = 320
  height = 180

  buffer!: Target

  init() {
    
    this.buffer = Target.create(this.width, this.height)

    batch.default_sampler = TextureSampler.make(TextureFilter.Nearest)
  }

  /* ... */

  render() {
    
    {
      this.buffer.clear(Color.hex(0x150e22))

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

  /* ... */
```

Instead of rendering directly to `App.backbuffer` (which represents the screen), we will render the game into `this.buffer`, which is another `Target` with 320x180 size. Finally we will render the output texture of `this.buffer` (received via `this.buffer.texture(0)`) into our `App.backbuffer` scaled to fill it's size and positioned on the center.

Finally we set the `batch.default_sampler` to use `Nearest` filtering mode to achieve pixelated look.


