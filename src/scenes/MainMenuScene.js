import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {

    // Add background image instead of solid color
    const bg = this.add.image(640, 360, 'bg_gameplay');
    const scaleX = 1280 / bg.width;
    const scaleY = 720 / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
    bg.setDepth(0);

    // Add dark overlay (0x000000, alpha 0.5) for text readability
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5);
    overlay.setDepth(1);

    // Modern UI Button with rounded corners
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
          x: 30,
          y: 15
        },
        fontStyle: 'bold'
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);

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