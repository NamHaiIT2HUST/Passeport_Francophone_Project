import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1d3557');

    this.add
      .text(640, 250, 'PASSEPORT FRANCOPHONE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '56px',
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5);

    this.add
      .text(640, 318, 'Mission Médiation', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#f4d35e',
        align: 'center'
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(640, 430, '▶ Commencer la mission', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 22,
          y: 14
        }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('MapScene');
    });
  }
}
