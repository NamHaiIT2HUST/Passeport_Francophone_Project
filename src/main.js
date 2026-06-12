import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import MapScene from './scenes/MapScene.js';
import GameScene from './scenes/GameScene.js';
import RoundtableScene from './scenes/RoundtableScene.js';
import ResultScene from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#1d3557',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [PreloaderScene, MainMenuScene, MapScene, GameScene, RoundtableScene, ResultScene]
};

new Phaser.Game(config);
