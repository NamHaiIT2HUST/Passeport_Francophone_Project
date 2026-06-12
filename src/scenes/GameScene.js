import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.persuasionScore = 50;
    this.scoreText = null;
    this.dialogueContainer = null;
    this.dialogueText = null;
    this.dialogueOpenedAt = 0;
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

    const dialogueX = 80;
    const dialogueY = 520;
    const dialogueWidth = 1120;
    const dialogueHeight = 150;

    const dialogueBackground = this.add.graphics();
    dialogueBackground.fillStyle(0x000000, 0.8);
    dialogueBackground.fillRoundedRect(0, 0, dialogueWidth, dialogueHeight, 18);
    dialogueBackground.lineStyle(3, 0xffffff, 0.35);
    dialogueBackground.strokeRoundedRect(0, 0, dialogueWidth, dialogueHeight, 18);

    const dialogueHitArea = this.add
      .zone(0, 0, dialogueWidth, dialogueHeight)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });

    this.dialogueText = this.add.text(28, 26, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      color: '#ffffff',
      wordWrap: {
        width: dialogueWidth - 56
      }
    });

    this.dialogueContainer = this.add.container(dialogueX, dialogueY, [
      dialogueBackground,
      dialogueHitArea,
      this.dialogueText
    ]);
    this.dialogueContainer.setVisible(false);

    dialogueHitArea.on('pointerdown', () => {
      this.hideDialogue();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.hideDialogue();
    });

    this.input.on('pointerup', (pointer) => {
      const canHideDialogue = this.dialogueContainer.visible && this.time.now - this.dialogueOpenedAt > 150;

      if (pointer.button === 0 && canHideDialogue) {
        this.hideDialogue();
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
      this.showDialogue('item_found');
      console.log('Đã nhặt bằng chứng & Gọi Twine Dialogue');
    });
  }

  showDialogue(nodeId) {
    const dialogueData = this.cache.json.get('dialogue');
    const node =
      dialogueData?.[nodeId] ??
      dialogueData?.nodes?.[nodeId] ??
      dialogueData?.passages?.find((passage) => passage.id === nodeId);

    if (!node) {
      console.warn(`Dialogue node not found: ${nodeId}`);
      return;
    }

    this.dialogueText.setText(node.text ?? '');
    this.dialogueContainer.setVisible(true);
    this.dialogueOpenedAt = this.time.now;
  }

  hideDialogue() {
    if (this.dialogueContainer) {
      this.dialogueContainer.setVisible(false);
    }
  }
}
