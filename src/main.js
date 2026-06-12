import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene';
import MainMenuScene from './scenes/MainMenuScene';
import IntroScene from './scenes/IntroScene';
import MapScene from './scenes/MapScene';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#000000',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    PreloaderScene,
    MainMenuScene,
    IntroScene,
    MapScene,
    GameScene
  ]
};

export default new Phaser.Game(config);