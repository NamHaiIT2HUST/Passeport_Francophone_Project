import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.persuasionScore = 50;
    this.scoreText = null;
    this.dialogueContainer = null;
    this.dialogueText = null;
    this.dialogueOpenedAt = 0;
    this.inventory = [];
    this.inventoryContainer = null;
    this.inventoryItemsContainer = null;
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

    const inventoryButton = this.add
      .text(1060, 24, '🎒 Inventaire', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#00000099',
        padding: {
          x: 14,
          y: 10
        }
      })
      .setInteractive({ useHandCursor: true });

    inventoryButton.on('pointerdown', () => {
      this.openInventory();
    });

    const roundtableButton = this.add
      .text(1248, 688, '⚖️ Aller à la Table Ronde', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        backgroundColor: '#6b3f1d',
        padding: {
          x: 14,
          y: 10
        }
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    roundtableButton.on('pointerdown', () => {
      this.scene.start('RoundtableScene', {
        score: this.persuasionScore,
        inventory: this.inventory
      });
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

    const inventoryBackground = this.add.graphics();
    inventoryBackground.fillStyle(0x000000, 0.88);
    inventoryBackground.fillRoundedRect(0, 0, 620, 420, 18);
    inventoryBackground.lineStyle(3, 0xffffff, 0.45);
    inventoryBackground.strokeRoundedRect(0, 0, 620, 420, 18);

    const inventoryTitle = this.add.text(32, 28, 'Inventaire', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#ffffff'
    });

    const closeInventoryButton = this.add
      .text(532, 28, 'Fermer', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#a33a3a',
        padding: {
          x: 12,
          y: 8
        }
      })
      .setInteractive({ useHandCursor: true });

    closeInventoryButton.on('pointerdown', () => {
      this.closeInventory();
    });

    this.inventoryItemsContainer = this.add.container(36, 96);
    this.inventoryContainer = this.add.container(330, 150, [
      inventoryBackground,
      inventoryTitle,
      closeInventoryButton,
      this.inventoryItemsContainer
    ]);
    this.inventoryContainer.setVisible(false);
    this.inventoryContainer.setDepth(20);

    const evidenceCard = this.add.rectangle(0, 0, 120, 120, 0xf4d35e)
      .setStrokeStyle(4, 0xffffff)
      .setInteractive({ useHandCursor: true });

    const evidenceLabel = this.add
      .text(0, 0, 'Thẻ\nbằng chứng', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#1d3557',
        align: 'center'
      })
      .setOrigin(0.5);

    const evidenceContainer = this.add.container(640, 380, [evidenceCard, evidenceLabel]);

    evidenceCard.on('pointerdown', () => {
      this.inventory.push({
        id: 'item_1',
        name: 'Vidéo de bûcherons'
      });
      this.persuasionScore += 20;
      this.scoreText.setText(`Persuasion Score: ${this.persuasionScore}`);
      evidenceContainer.setVisible(false);
      evidenceCard.disableInteractive();
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

  openInventory() {
    this.inventoryItemsContainer.removeAll(true);

    if (this.inventory.length === 0) {
      this.inventoryItemsContainer.add(
        this.add.text(0, 0, 'Aucun objet pour le moment.', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          color: '#dddddd',
          wordWrap: {
            width: 548
          }
        })
      );
    }

    this.inventory.forEach((item, index) => {
      const itemText = this.add.text(0, index * 48, `• ${item.name}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        wordWrap: {
          width: 548
        }
      });

      this.inventoryItemsContainer.add(itemText);
    });

    this.inventoryContainer.setVisible(true);
  }

  closeInventory() {
    if (this.inventoryContainer) {
      this.inventoryContainer.setVisible(false);
    }
  }
}
