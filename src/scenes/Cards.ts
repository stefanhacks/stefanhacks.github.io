import * as PIXI from 'pixi.js';
import { GAME_WIDTH, Scene } from '../GameConstants';

export default class Cards extends PIXI.Container implements Scene {
  app?: PIXI.Application;
  cards: Array<PIXI.Sprite> = [];
  totalCards = 144;
  textureFront = PIXI.Texture.from('cardfront');
  textureBack = PIXI.Texture.from('cardback');

  constructor() {
    super();
    this.sortableChildren = true;
  }

  public start(app: PIXI.Application): void {
    this.app = app;
    this.makeCards();
  }

  /**
   * Makes all cards on the deck.
   */
  private makeCards(): void {
    if (this.app === null) return;

    for (let i = 0; i < this.totalCards; i += 1) {
      this.cards.push(this.makeSingleCard(i));
    }
  }

  /**
   * Makes a single card and readies it for animation.
   * @param i Number of the card in question. Used for timing.
   * @returns PIXI.Sprite, which is the instantiated card.
   */
  private makeSingleCard(i: number): PIXI.Sprite {
    const card = PIXI.Sprite.from(this.textureFront);
    const originX = GAME_WIDTH / 2 - 200 - (i / 8);
    const originY = 250 + i;

    const app = this.app as PIXI.Application;

    card.anchor.set(0.5);
    card.x = originX;
    card.y = originY;

    let timer = 0;
    const delay = 60 + 60 * (this.totalCards - i);

    const move = (delta: number) => {
      timer += delta;

      if (timer > delay + 120) {
        card.zIndex = -i;
        app.ticker.remove(move);
      } else if (timer > delay) {
        const deltaT = timer - delay;
        const adjustedX = 200 - i / 8;
        const adjustedY = 100 + i;

        card.x = originX + Math.min((adjustedX * deltaT) / 60, 400);
        card.y = originY + Math.min((adjustedY * deltaT) / 60, 800);
        
        card.tint = timer > delay + 60 ? '770077' : 'FFFFFF';
        card.texture = timer > delay + 60 ? this.textureBack : this.textureFront;
        card.scale.x = Math.abs(Math.cos(deltaT / 40));
      }
    };

    app.ticker.add(move);
    this.addChild(card);

    return card;
  }
}
