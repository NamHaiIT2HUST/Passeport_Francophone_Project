import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    this.cameras.main.setBackgroundColor('#1d3557');

    const barWidth = 640;
    const barHeight = 28;
    const barX = 320;
    const barY = 360;

    this.add.text(640, 300, 'Chargement...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const loadingBorder = this.add.graphics();
    loadingBorder.lineStyle(3, 0xffffff, 0.8);
    loadingBorder.strokeRoundedRect(barX, barY, barWidth, barHeight, 8);

    const loadingFill = this.add.graphics();

    this.load.on('progress', (value) => {
      loadingFill.clear();
      loadingFill.fillStyle(0xf4d35e, 1);
      loadingFill.fillRoundedRect(barX + 4, barY + 4, (barWidth - 8) * value, barHeight - 8, 6);
    });

    this.load.image('bg', '/assets/background.svg');
    this.load.image('map_bg', '/assets/map_bg.svg');
    this.load.image('npc_sprite', '/assets/npc_sprite.svg');

    this.load.json('items', '/twine_data/items.json');
    this.load.json('dialogues', '/twine_data/dialogues.json');
    this.load.json('rounds', '/twine_data/rounds.json');
    this.load.json('vocab', '/twine_data/vocab.json');
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}

