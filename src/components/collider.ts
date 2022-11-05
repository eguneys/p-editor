import { Color, Rect, Mat3x2 } from 'blah'
import { Batch } from 'blah'
import { Component } from '../world'

export class Collider extends Component {

  static make_grid(tile_size: number, columns: number, rows: number) {
    return new Collider(new Grid(columns, rows, tile_size))
  }

  constructor(readonly i_collider: Rectangle | Grid) {
    super()
  }

  set_cell(x: number, y: number, value: boolean) {
    if (this.i_collider instanceof Grid) {
      this.i_collider.set_cell(x, y, value)
    }
  }

  render(batch: Batch) {
    batch.push_matrix(Mat3x2.create_translation(this.entity.position))
    this.i_collider.render(batch)
    batch.pop_matrix()
  }

}

class Rectangle {
  render(batch: Batch) {
  }
}

class Grid {

  cells: Array<boolean>

  constructor(readonly columns: number,
              readonly rows: number,
              readonly tile_size: number) {
                this.cells = []
              }

  set_cell(x: number, y: number, value: boolean) {
    this.cells[x + y * this.columns] = value
  }

  render(batch: Batch) {

    let color = Color.red

    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (!this.cells[x + y * this.columns]) {
          continue
        }
        batch.rect_line(
          Rect.make(x * this.tile_size, y * this.tile_size,
                    this.tile_size, this.tile_size),
                    1,
                    color)
      }
    }
  }
}

