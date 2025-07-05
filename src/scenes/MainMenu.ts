import * as PIXI from 'pixi.js';
import SWITCH_SCENE from './SceneEvents';
import { BUTTONS, GAME_HEIGHT, GAME_WIDTH, Scene } from '../GameConstants';

const BUTTON_POSITIONS = [GAME_HEIGHT / 3, GAME_HEIGHT / 2, GAME_HEIGHT / 2 + GAME_HEIGHT / 6];

export default class MainMenu extends PIXI.Container implements Scene {
  style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 42,
    fontWeight: 'bold',
    fill: ['#ffffff', '#dddddd'], // gradient
    stroke: '#0b2247',
    strokeThickness: 9,
    lineJoin: 'round',
  });

  constructor() {
    super();

    this.makeButton('Cards Demo', BUTTONS.CARD, BUTTON_POSITIONS[0]);
    this.makeButton('Words Reel', BUTTONS.WORD, BUTTON_POSITIONS[1]);
    this.makeButton('Fire Effect', BUTTONS.FIRE, BUTTON_POSITIONS[2]);
  }

  public start(): void {}

  /**
   * Given label and BUTTON purpose, adds a button ready to read input.
   * @param label Displayed String on top of button.
   * @param purpose Enum for Purpose. Mapped in Scene Manager.
   * @param position Y Position of where button should lie.
   */
  private makeButton(label: string, purpose: BUTTONS, position: number): void {
    const text = new PIXI.Text(label, this.style);

    text.anchor.set(0.5, 0.5);
    text.x = GAME_WIDTH / 2;
    text.y = position;

    const button = new PIXI.Graphics();

    button.alpha = 0.8;
    button.beginFill(0x42bff5);
    button.drawRect(130, position - 50, GAME_WIDTH - 260, 100);
    button.interactive = true;
    // button.buttonMode = true;

    button.on('pointerup', () => this.emit(SWITCH_SCENE, purpose));

    this.addChild(button);
    this.addChild(text);
  }
}
