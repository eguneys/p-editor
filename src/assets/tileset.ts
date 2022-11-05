import { Subtexture } from 'blah'
import Game from '../game'

export class Tileset {

  get random_tile() {
    return this.tiles[Game.rand_int(0, this.tiles.length)]
  }

  constructor(readonly name: string,
              readonly tiles: Array<Subtexture>) {}

}
