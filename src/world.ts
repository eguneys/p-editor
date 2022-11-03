import { Vec2 } from 'blah'
import { Batch } from 'blah'

export abstract class Component {

  entity!: Entity

  abstract render(batch: Batch): void
}


export class Entity {

  readonly components: Array<Component> = []

  constructor(readonly position: Vec2,
              readonly world: World) { }

  add(component: Component) {
    this.world.add(this, component)
  }
}

export class World {

  readonly entities: Array<Entity> = []
  readonly components: Map<string, Array<Component>> = new Map()

  first_entity(T: typeof Entity) {
    return this.entities.find(_ => _ instanceof T)
  }

  all_entities(T: typeof Entity) {
    return this.entities.filter(_ => _ instanceof T)
  }

  add_entity(position: Vec2) {
    let instance = new Entity(position, this)

    this.entities.push(instance)
    return instance
  }

  /* https://stackoverflow.com/questions/74303395/how-to-filter-an-array-based-on-type-parameters-typeof */
  all<T extends Component>(ctor: { new(...args: any[]): T }): Array<T>;
  all(ctor: typeof Component) {
    return this.components.get(ctor.name) ?? []
  }

  add(entity: Entity, component: Component) {

    let _ = this.components.get(component.constructor.name)

    if (!_) {
      _ = []
      this.components.set(component.constructor.name, _)
    }

    _.push(component)

    component.entity = entity

    return component
  }

}
