import * as PIXI from 'pixi.js';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter'
import { FIRE_EMITTER, Scene } from '../GameConstants';

export default class Fire extends PIXI.Container implements Scene {
  public start(): void {
    const emitter = new Emitter(this, upgradeConfig(FIRE_EMITTER, ['particle']));

    emitter.updateOwnerPos(window.innerWidth / 2 - 40, window.innerHeight / 2 + 100);
    let elapsed = Date.now();

    const update = function up() {
      requestAnimationFrame(update);
      const now = Date.now();

      emitter.update((now - elapsed) * 0.001);
      elapsed = now;
    };

    // Start emitting
    emitter.emit = true;
    update();

    window.onpointerdown = (event) => {
      const clickPosition = new PIXI.Point(event.x, event.y);
      const { x, y } = this.toLocal(clickPosition);

      emitter.updateOwnerPos(x, y);
    };
  }
}
