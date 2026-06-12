import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {

    this.cameras.main.setBackgroundColor('#1d3557');

    this.add.text(
      640,
      250,
      'PASSEPORT FRANCOPHONE',
      {
        fontFamily: 'Arial',
        fontSize: '56px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.text(
      640,
      320,
      'Mission Médiation',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#f4d35e'
      }
    ).setOrigin(0.5);

    const startBtn = this.add.text(
      640,
      450,
      '▶ Commencer la mission',
      {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 20,
          y: 12
        }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: startBtn,
      alpha: 0.5,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    startBtn.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });
  }
}