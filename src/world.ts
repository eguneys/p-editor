export class Component {
}


export class Entity {

  readonly components: Array<Component> = []

}

export class T extends Component {}
export class F extends Component {}

export class World {

  readonly entities: Array<Entity> = []
  readonly components: Map<typeof Component, Array<Component>> = new Map()

  first_entity(T: typeof Entity) {
    return this.entities.find(_ => _ instanceof T)
  }

  all_entities(T: typeof Entity) {
    return this.entities.filter(_ => _ instanceof T)
  }

  first<T extends Component>(ctor: { new(...args: any[]): T }) {
    return this.components.get(ctor)
  }

  constructor() {

    this.components.set(T, [new T()])
    this.components.set(F, [new F(), new F()])

    console.log(this.first<F>(F))

  }
}
