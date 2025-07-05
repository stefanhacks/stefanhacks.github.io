import * as PIXI from 'pixi.js';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter'
import { FIRE_EMITTER, Scene } from '../GameConstants';

export default class Fire extends PIXI.Container implements Scene {
  public start(): void {
    // Creates an Emitter object with the definitions found in config object.
    const emitter = new Emitter(this, upgradeConfig(FIRE_EMITTER, ['particle']));

    emitter.updateOwnerPos(window.innerWidth / 2 - 40, window.innerHeight / 2 + 100);
    let elapsed = Date.now();

    // Updates emitter based on time with low rou.
    const rateOfUpdate = 0.001;
    const update = function up() {
      requestAnimationFrame(update);
      const now = Date.now();

      emitter.update((now - elapsed) * rateOfUpdate);
      elapsed = now;
    };

    // Start emitting
    emitter.emit = true;
    update();

    window.onpointerdown = (event) => {
      // Creates a PIXI point on screen with pointer coordinates, before
      // passing it to this PIXI object and figuring out its local ones.
      const clickPosition = new PIXI.Point(event.x, event.y);
      const { x, y } = this.toLocal(clickPosition);

      emitter.updateOwnerPos(x, y);
    };
  }
}
