import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    this.add.image(640, 360, 'map_bg');

    this.add
      .text(640, 96, 'CARTE DU MONDE FRANCOPHONE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5);

    this.createMissionButton(300, 280, '📍 Mission 1: Madagascar', 'mada');
    this.createMissionButton(820, 440, '📍 Mission 2: Québec', 'quebec');
  }

  createMissionButton(x, y, label, levelId) {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 18,
          y: 12
        }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', () => {
      this.scene.start('GameScene', {
        levelId
      });
    });
  }
}

