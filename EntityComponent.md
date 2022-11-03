## A simple Entity Component system and a World

Try these examples in `game.ts` at the top level of the file then remove them. First import these classes

`game.ts`
```js
import { batch, Batch } from 'blah'
import { World, Entity, Component } from './world'

```

A Component defines behaviour and game logic. It has a `render(batch: Batch)` method for rendering. Let's define a Component that logs to the console when rendered:


```js
class Logger extends Component {

  _prefix!: string

  render(batch: Batch) {
    console.log(this._prefix, this.entity.position)
  }

}
```

Component also keeps the entity it belongs to, namely `this.entity`. We log it's position as well. We will use this component later.

An Entity has a bunch of components and a position. A World keeps all the entities and their components.

```js
let world = new World()

let entity = world.add_entity(Vec2.make(0, 0))
let logger = entity.add(new Logger())
logger._prefix = 'hello'

console.log('first render')
world.render(batch)
```

`world.add_entity(position: Vec2): Entity` adds an entity to the world at `position` and returns it.

Note that it log to the console because of the Logger Component.
```
first render
hello {x: 0, y: 0}
```

Now Let's define an Enemy Component and a Player Component.


```js
class Player extends Component { render(batch: Batch) {} }
class Enemy extends Component { render(batch: Batch) {} }

let entity2 = world.add_entity(Vec2.make(0, 0))
let logger2 = entity2.add(new Logger())
logger2._prefix = 'logger 2'
let player = entity2.add(new Player())

let entity3 = world.add_entity(Vec2.make(0, 0))
let logger3 = entity3.add(new Logger())
logger3._prefix = 'logger 3'
let enemy = entity3.add(new Enemy())

console.log('second render')
world.render(batch)
```

Now it logs three times Logger components of three entities:

```
second render
hello {x: 0, y: 0}
logger 2 {x: 0, y: 0}
logger 3 {x: 0, y: 0}
```

Now at some point in code we want the player to log something different:

```js
let _player = world.first(Player)
if (_player) {
  _player.get(Logger)!._prefix = 'player logger'
}

console.log('third render')
world.render(batch)

```

`world.first(Player)` returns the first Component that is an instance of `Player`

`_player.get(Logger)` returns the `Logger` Component with the same entity as the `_player`. It basically asks the `_player` component's entity to return the Logger component that it has.

Then we change the `_prefix` of the Logger Component of the Entity that has the Player Component. So that the player will log something different now.

As we can see from the logs:

```
third render
hello {x: 0, y: 0}
player logger {x: 0, y: 0}
logger 3 {x: 0, y: 0}
```

Optionally you can give different positions to cross check that it logs different actually for the player.
