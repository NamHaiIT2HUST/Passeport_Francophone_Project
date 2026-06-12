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

    this.load.image(
      'bg_quebec',
      'assets/bg_quebec.jpg'
    );

    this.load.image(
      'bg_add',
      'assets/bg_add.png'
    );

    // CHARACTERS

    this.load.image(
      'npc_manager',
      'assets/npc_manager.png'
    );

    this.load.image(
      'npc_quebec_resident',
      'assets/npc_quebec_resident.jpg'
    );

    // UI ELEMENTS

    this.load.image(
      'target_ring',
      'assets/target_ring.png'
    );

    // AUDIO

    this.load.audio(
      'intro_voice',
      'assets/intro_voice.mp3'
    );

    this.load.audio(
      'ambient_wind',
      'assets/ambient_wind.mp3'
    );

    this.load.audio(
      'footstep',
      'assets/footstep.mp3'
    );

    this.load.audio(
      'click_ui',
      'assets/click_ui.mp3'
    );
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}