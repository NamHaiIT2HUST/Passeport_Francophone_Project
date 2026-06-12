import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene';
import MainMenuScene from './scenes/MainMenuScene';
import IntroScene from './scenes/IntroScene'; // Thêm dòng này
import MapScene from './scenes/MapScene';
import GameScene from './scenes/GameScene';
import RoundtableScene from './scenes/RoundtableScene';
import ResultScene from './scenes/ResultScene';

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
  // Nối IntroScene vào giữa MainMenu và MapScene
  scene: [PreloaderScene, MainMenuScene, IntroScene, MapScene, GameScene, RoundtableScene, ResultScene]
};

export default new Phaser.Game(config);