import { Mat3x2, Vec2 } from 'blah'
import { Batch } from 'blah'
import { Subtexture } from 'blah'
import { Component } from '../world'

export class Tilemap extends Component {

  static make = (tile_width: number, 
                 tile_height: number, 
  columns: number,
  rows: number) => { return new Tilemap(tile_width, tile_height, columns, rows) }

  m_grid: Array<Subtexture | undefined>

  constructor(readonly tile_width: number, 
              readonly tile_height: number, 
              readonly columns: number,
              readonly rows: number) {
                super()

                this.m_grid = []

              }

  set_cell(x: number, y: number, tex?: Subtexture) {
    this.m_grid[x + y * this.columns] = tex
  }

  render(batch: Batch) {
    batch.push_matrix(Mat3x2.create_translation(this.entity.position))
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        let tex = this.m_grid[x + y * this.columns]
        if (tex) {
          batch.stex(tex, Vec2.make(x * this.tile_width, y * this.tile_height))
        }
      }
    }
    batch.pop_matrix()
  }

}
