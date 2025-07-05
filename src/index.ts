import { Application, Assets } from 'pixi.js';
import SceneManager from './controllers/SceneManager';
import { GAME_HEIGHT, GAME_WIDTH } from './GameConstants';
import './style.css';

const app = new Application<HTMLCanvasElement>({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

/**
 * Loads whatever assets game still has.
 * @returns Promise that resolves or rejects based on load status.
 */
async function loadGameAssets(): Promise<void> {
  const manifest = {
    bundles: [{
      name: "game-assets",
      assets: [
        { name: "cardfront", srcs: './assets/cardfront.png' },
        { name: "cardback", srcs: './assets/cardback.png' },
        { name: "particle", srcs: './assets/particle.png' },
      ],
    }],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle('game-assets');
}

/**
 * Resizes canvas based on ratio. Somewhat inconsistent.
 */
function resizeCanvas(): void {
  const resize = () => {
    const { innerHeight } = window;
    const scale = innerHeight / GAME_HEIGHT;
    const width = GAME_WIDTH * scale;

    app.renderer.resize(width, innerHeight);
    app.stage.scale.x = width / GAME_WIDTH;
    app.stage.scale.y = innerHeight / GAME_HEIGHT;
  };

  resize();

  window.addEventListener("resize", resize);
}


window.onload = async (): Promise<void> => {
  await loadGameAssets();

  document.body.appendChild(app.view);

  resizeCanvas();
  new SceneManager(app);
};
