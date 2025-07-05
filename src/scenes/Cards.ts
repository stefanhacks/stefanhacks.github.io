import * as PIXI from 'pixi.js';
import { GAME_WIDTH, Scene } from '../GameConstants';

export default class Cards extends PIXI.Container implements Scene {
  app?: PIXI.Application;
  cards: Array<PIXI.Sprite> = [];
  totalCards = 144;

  cardTextureFront = PIXI.Texture.from('cardfront');
  cardTextureBack = PIXI.Texture.from('cardback');
  cardFrontTint = 'FFFFFF'; // White
  cardBackTint = '770077'; // Purple

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
    const app = this.app as PIXI.Application;
    const card = PIXI.Sprite.from(this.cardTextureFront);
    const originX = GAME_WIDTH / 2 - 200 - (i / 8);
    const originY = 250 + i;
    const movementDuration = 120;
    const interval = movementDuration / 2

    card.anchor.set(0.5);
    card.x = originX;
    card.y = originY;

    let timer = 0;
    const delay = interval + interval * (this.totalCards - i);

    const move = (delta: number) => {
      timer += delta;
      const deltaT = timer - delay;
      const adjustedX = 200 - i / 8;
      const adjustedY = 200;

      // Movement should end after 2s, cleaning up the ticker function.
      if (deltaT > movementDuration) {
        app.ticker.remove(move);
        card.zIndex = -i;
        
        // Hard setting variables at the end to make sure movement
        // is displayed properly regardless of FPS and performance.
        card.scale.x = 1;
        card.x = originX + adjustedX * 2;
        card.y = originY + adjustedY * 2;
      } else if (deltaT > 0) {
        const deltaT = timer - delay;

        // Moves cards based on interval of time, flipping them halfway
        // through, which also changes texture and tints the object.
        card.x = originX + (adjustedX * deltaT) / interval;
        card.y = originY + (adjustedY * deltaT) / interval;
        
        card.tint = timer > delay + interval ? this.cardBackTint : this.cardFrontTint;
        card.texture = timer > delay + interval ? this.cardTextureBack : this.cardTextureFront;
        card.scale.x = Math.abs(Math.cos(deltaT / (movementDuration / 3)));
      }
    };

    app.ticker.add(move);
    this.addChild(card);

    return card;
  }
}
