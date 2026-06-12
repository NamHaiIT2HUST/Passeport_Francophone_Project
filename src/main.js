import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';
import RoundtableScene from './scenes/RoundtableScene.js';

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
  scene: [GameScene, RoundtableScene]
};

new Phaser.Game(config);
