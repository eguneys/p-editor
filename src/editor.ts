import { AllPlays, WithPlays } from './play'

class Background extends WithPlays {

  _draw() {

  }
}

export default class App extends AllPlays {

  _init() {
    this.make(Background)
  }
}
