import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.persuasionScore = 50;
    this.scoreText = null;
  }

  preload() {
    this.load.image('bg', '/assets/background.svg');
    this.load.json('dialogue', '/twine_data/dialogue.json');
  }

  create() {
    this.add.image(640, 360, 'bg');

    this.scoreText = this.add.text(24, 24, 'Persuasion Score: 50', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: {
        x: 12,
        y: 8
      }
    });

    const evidenceCard = this.add
      .rectangle(640, 380, 120, 120, 0xf4d35e)
      .setStrokeStyle(4, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(evidenceCard.x, evidenceCard.y, 'Thẻ\nbằng chứng', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#1d3557',
        align: 'center'
      })
      .setOrigin(0.5);

    evidenceCard.on('pointerdown', () => {
      this.persuasionScore += 20;
      this.scoreText.setText(`Persuasion Score: ${this.persuasionScore}`);
      console.log('Đã nhặt bằng chứng & Gọi Twine Dialogue');
    });
  }
}

