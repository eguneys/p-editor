import { Vec2, Subtexture } from 'blah'

class Frame {
  constructor(readonly image: Subtexture,
              readonly duration: number) {}
}

class Animation {

  constructor(readonly name: string,
              readonly frames: Array<Frame>) {}

}


export class Sprite {


  constructor(readonly name: string,
              readonly origin: Vec2,
              readonly animations: Array<Animation>) {}

}
