import { Vec2 } from './vec2'

export class XP2 {

  static make_x = (mass: number, x: number) => {
    return new XP2(mass, Vec2.make(x, 0), Vec2.zero)
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }

  mass: number
  position: Vec2
  velocity: Vec2

  previous_position: Vec2

  forces: Array<Vec2>

  get external_force() {
    return this.forces.reduce((acc, _) => acc.add_in(_), Vec2.zero)
  }

  get inverse_mass() {
    return 1 / this.mass
  }

  constructor(mass: number,
              position: Vec2,
              velocity: Vec2,
              readonly nb_substeps: number = 1) {

      this.forces = []

      this.previous_position = position
      this.position = position
      this.mass = mass
      this.velocity = velocity
  }

  update(dt: number) {
    let h = dt / this.nb_substeps

    for (let i = 0; i < this.nb_substeps; i++) {
      this.previous_position = this.position.clone
      this.velocity.add_in(this.external_force.scale(h * this.inverse_mass))

      this.position.add_in(this.velocity.scale(h))

      this.velocity = this.position.sub(this.previous_position).scale(1/h)
    }

    this.forces = []
  }

}
