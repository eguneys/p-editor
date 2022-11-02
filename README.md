# Walkthrough of Tiny Link Game of Noel Berry

Noel Berry, creator of Celeste, has made a Zelda inspired platformer game on his [twitch stream](https://www.twitch.tv/noelfb) in 15 hours.

He used a C++ game framework called [blah](https://github.com/NoelFB/blah) that he wrote himself in about 6 months. It supports both OpenGL and DirectX, and works on Windows or SDL supported platforms.

The game uses a simple Entity Component architecture, a grid based map and colliders, and content like tilesets and animations loaded directly from Aseprite files. 

This is a walkthrough of his process in Typescript and WebGL. It uses the rewrite of the [blah framework in Typescript](https://github.com/eguneys/blah).

There is also a [walkthrough of PICO-8 version of Celeste](https://github.com/eguneys/celeste-jumping) written previously.

Currently Noel streams about his side project that is Megaman inspired metroidvania. It features 2D Platforming with slopes, handles collisions with Separating Axis Theorem, a level editor, and enemy behaviour described using coroutines. These will be the topic of our next post.

Finally the internals of the rewrite of "blah" game framework in Typescript will also be discussed last.


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

