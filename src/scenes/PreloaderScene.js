import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {

    this.add.text(
      640,
      360,
      'Chargement...',
      {
        fontSize: '32px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // BACKGROUNDS

    this.load.image(
      'bg_office',
      'assets/bg_office.png'
    );

    this.load.image(
      'bg_map',
      'assets/bg_map.png'
    );

    // CHARACTERS

    this.load.image(
      'npc_manager',
      'assets/npc_manager.png'
    );

    // AUDIO

    this.load.audio(
      'intro_voice',
      'assets/intro_voice.mp3'
    );
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}