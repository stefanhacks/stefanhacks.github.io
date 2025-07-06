import * as PIXI from 'pixi.js';
import { GAME_HEIGHT, GAME_WIDTH, Scene } from '../GameConstants';

type AvatarData = { name: string, url: string, position: 'left' | 'right'};
type DialogueData = { name: string, text: string };
type EmojiData = { name: string, url: string };
type EndpointData = { avatars: Array<AvatarData>, dialogue: Array<DialogueData>, emojies: Array<EmojiData>};


export default class MagicWords extends PIXI.Container implements Scene {
  endpoint = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';
  ready = false;

  parsedAvatarData: Record<string, { image: PIXI.Texture, position: 'left' | 'right' }> = {};
  parsedEmojiData: Record<string, string > = {};
  dialogData: Array<DialogueData> = [];
  dialogIndex = 0;

  fontSize = 42;
  style = new PIXI.TextStyle({
    fontSize: this.fontSize,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: ['#ffffff', '#dddddd'], // gradient
    stroke: '#0b2247',
    strokeThickness: 9,
    lineJoin: 'round',
    wordWrap: true,
    wordWrapWidth: GAME_WIDTH - 100,
  });

  avatar: PIXI.Sprite = new PIXI.Sprite();
  textName: PIXI.Text = new PIXI.Text('', this.style);
  textContainer: PIXI.Container = new PIXI.Container();
  instructions: PIXI.Text = new PIXI.Text('Click to Advance Text', { ... this.style, fontSize: 20 });


  public start(): void {
    window.onpointerdown = () => this.clickOnScreen();
    this.addChild(this.avatar);
    this.makeText();
    this.run();
  }
  
  /**
   * Makes PIXI.Text component and positions it accordingly.
   * @returns aforementioned PIXI.Text component.
   */
  private makeText(): void {
    this.textName.x = 100;
    this.textName.y = GAME_HEIGHT / 3;

    this.textContainer.x = 100;
    this.textContainer.y = (GAME_HEIGHT / 3) + 100;

    this.addChild(this.textName);
    this.addChild(this.textContainer);
  }

  /**
   * Reaches Softgames Endpoint for dialogue data.
   * @returns A promise that resolves with a json with the dialogue data.
   */
  private async fetchTextData(): Promise<EndpointData> {
    return await fetch(this.endpoint)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        this.ready = true;
        
        return response.json();
      });
  }

  /**
   * Fetches, parses and initializes the dialogue loop.
   */
  private async run() {
    const data = await this.fetchTextData();

    this.parseAvatars(data.avatars);
    this.parseEmojies(data.emojies);
    this.dialogData = data.dialogue;

    this.addChild(this.instructions);
    this.instructions.x = 250;
    this.instructions.y = GAME_HEIGHT - 200;

    this.clickOnScreen();
  }

  /**
   * Converts and stores the data containing avatar resources into the internal avatarData object.
   * @param avatarData The object carried by the EndpointData object containing Avatar resources.
   */
  private parseAvatars(avatarData: Array<AvatarData>) {
    avatarData.forEach((avatar: AvatarData) => 
      this.parsedAvatarData[avatar.name] = { image: PIXI.Texture.from(avatar.url), 'position': avatar.position });
  }

  /**
   * Converts and stores the data containing emoji resources into the internal emojiData object.
   * @param emojiData The object carried by the EndpointData object containing Avatar resources.
   */
  private parseEmojies(emojiData: Array<EmojiData>) {
    emojiData.forEach((emoji: EmojiData) => 
      this.parsedEmojiData[emoji.name] = emoji.url);
  }

  /**
   * Updates the Avatar image on screen with the provided resources. 
   * Also hides the Avatar if provided image key is not found.
   * @param key Avatar Name, to fetch data from internal parsedAvatarData object.
   * @param position Either 'left' or 'right'. Used to properly position avatar on screen.
   */
  private updateAvatar(key: string, position: 'left' | 'right'): void {
    const avatarData = this.parsedAvatarData[key];

    if (avatarData === undefined) {
      this.avatar.visible = false;

      return;
    }
    
    this.avatar.visible = true;
    this.avatar.texture = avatarData.image;
    const originX = GAME_WIDTH / 2 + (position === 'left' ? 200 : -200)
    const originY = 250;

    this.avatar.anchor.set(0.5);
    this.avatar.x = originX;
    this.avatar.y = originY;
    this.avatar.scale = { x: 2, y: 2 };
  }

  /**
   * Updates the Text displayed on screen with the provided resources.
   * Exchanges tagged text surrounded by '{}' with emojis found in the emojiData object.
   * If emojis are not found, tagged text is hidden.
   * @param name Name to populate the object that indicates the speaker.
   * @param text Text to populate the object that indicates the speech.
   */
  private updateText(name: string, text: string): void {
    // Cleans text container of current text.
    this.textName.text = name;
    this.textContainer.removeChildren();
    const lineWidth = 600;
    const lineHeight = 60;
    let x = 0;
    let y = 0;

    // Splits all Words and removes empty ones.
    const tokens = text.split(/(\s+)/g).filter(Boolean);
    
    // Cycles through words, finds which are present in
    // the emojiData object, and acts according to type.
    for (const token of tokens) {
      let displayObject;
      let tokenWidth = 0

      const cleanedToken = token.slice(1, -1);
      const pattern = /^\{(\w+)\}$/;
      
      // If pattern is found, {word} is present on string,
      // but might not be on emojiData object.
      if (pattern.test(token)) {
        if (this.parsedEmojiData[cleanedToken]) {
          const sprite = PIXI.Sprite.from(this.parsedEmojiData[cleanedToken]);

          sprite.anchor.x = 0;
          sprite.anchor.y = -0.25;

          sprite.width = +this.style.fontSize;
          sprite.height = +this.style.fontSize;
          displayObject = sprite;
          tokenWidth = sprite.width;
        }
      } else {
        const textObj = new PIXI.Text(token, this.style);

        displayObject = textObj;
        tokenWidth = textObj.width;
      }

      // Figures out if this word would make the line longer
      // than the lineWidth provided. TODO: If the word is 
      // absurdly long, there might be issues here.
      if (x + tokenWidth > lineWidth) {
        x = 0;
        y += lineHeight;
      }

      // There's a chance no object is to be displayed. This 
      // happens if a {word} was provided but no match was
      // found on emojiData object.
      if (displayObject) {
        displayObject.x = x;
        displayObject.y = y;
        this.textContainer.addChild(displayObject);
      }

      x += tokenWidth;
    }
  }

  /**
   * Function that cycles through text.
   */
  private clickOnScreen() {
    if (this.ready === false) return;

    const dialogue = this.dialogData[this.dialogIndex];
    const avatarKey = dialogue.name
    const text = dialogue.text;
    const avatarPosition = this.parsedAvatarData[avatarKey]?.position;
    
    this.updateAvatar(avatarKey, avatarPosition);
    this.updateText(avatarKey, text);

    this.dialogIndex = (this.dialogIndex + 1) % this.dialogData.length;
  }
}
