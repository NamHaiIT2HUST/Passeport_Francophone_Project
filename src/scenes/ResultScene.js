import Phaser from 'phaser';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
    this.score = 0;
    this.levelId = 'mada'; // Thêm biến hứng ID màn chơi
  }

  init(data) {
    this.score = data.score ?? 0;
    this.levelId = data.levelId ?? 'mada';
  }

  create() {
    const hasWon = this.score >= 50;

    this.cameras.main.setBackgroundColor('#1d3557');

    this.add
      .text(640, 220, hasWon ? '🎉 Félicitations ! Mission accomplie.' : '❌ Échec de la négociation.', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        color: hasWon ? '#8fd694' : '#ff6b6b',
        align: 'center',
        wordWrap: {
          width: 1000
        }
      })
      .setOrigin(0.5);

    this.add
      .text(
        640,
        320,
        hasWon
          ? `Votre score final est ${this.score}. La forêt est protégée.\n\n🛂 Votre passeport a été tamponné !`
          : `Votre score final est ${this.score}. La négociation a échoué, essayez une autre stratégie.`,
        {
          fontFamily: 'Arial, sans-serif',
          fontSize: '28px',
          color: '#ffffff',
          align: 'center',
          wordWrap: {
            width: 880
          }
        }
      )
      .setOrigin(0.5);

    // LƯU TRẠNG THÁI VÀO REGISTRY NẾU THẮNG
    if (hasWon) {
        this.registry.set(`${this.levelId}_cleared`, true);
    }

    const replayButton = this.add
      .text(640, 480, '🗺️ Retour à la Carte', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '30px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 28,
          y: 14
        }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    replayButton.on('pointerdown', () => {
      this.scene.start('MapScene'); // Trỏ về MapScene thay vì MainMenu
    });
  }
}