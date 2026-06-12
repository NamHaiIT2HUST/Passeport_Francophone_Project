import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.levelId = 'mada';
    this.persuasionScore = 50;
    this.inventory = [];
    this.itemsData = [];
    this.levelItems = [];
    this.dialoguesData = {};
    this.vocabData = {};
    this.scoreText = null;
    this.notificationText = null;
    this.dialogueContainer = null;
    this.dialogueText = null;
    this.dialogueTextContainer = null;
    this.dialogueOpenedAt = 0;
    this.highlightedVocabTerm = null;
    this.inventoryContainer = null;
    this.inventoryItemsContainer = null;
    this.dictionaryModal = null;
    this.dictionaryListContainer = null;
    this.dictionaryDetailText = null;
  }

  init(data) {
    this.levelId = data.levelId ?? 'mada';
    this.persuasionScore = data.score ?? 50;
    this.inventory = data.inventory ? [...data.inventory] : [];
    this.highlightedVocabTerm = null;
  }

  create() {
    this.add.image(640, 360, 'bg');

    this.itemsData = this.cache.json.get('items') ?? [];
    this.levelItems = this.itemsData.filter((item) => item.level === this.levelId);
    this.dialoguesData = this.cache.json.get('dialogues') ?? {};
    this.vocabData = this.cache.json.get('vocab') ?? {};

    this.add.text(640, 36, `Mission: ${this.getLevelName()}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: {
        x: 14,
        y: 8
      }
    }).setOrigin(0.5, 0);

    this.createTopBar();
    this.createRoundtableButton();
    this.createDialogueBox();
    this.createInventoryModal();
    this.createDictionaryModal();
    this.createNotificationText();
    this.spawnExplorationPoints();
  }

  getLevelName() {
    const names = {
      mada: 'Madagascar',
      quebec: 'Québec'
    };

    return names[this.levelId] ?? this.levelId;
  }

  createTopBar() {
    const dictionaryButton = this.add
      .text(24, 24, '📖 Dictionnaire', {
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

    dictionaryButton.on('pointerdown', () => {
      this.openDictionary(this.highlightedVocabTerm);
    });

    this.scoreText = this.add.text(24, 86, `Persuasion Score: ${this.persuasionScore}`, {
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
  }

  createRoundtableButton() {
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
        levelId: this.levelId,
        score: this.persuasionScore,
        inventory: this.inventory
      });
    });
  }

  createDialogueBox() {
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
    this.dialogueTextContainer = this.add.container(28, 26);

    this.dialogueContainer = this.add.container(dialogueX, dialogueY, [
      dialogueBackground,
      dialogueHitArea,
      this.dialogueText,
      this.dialogueTextContainer
    ]);
    this.dialogueContainer.setVisible(false);
    this.dialogueContainer.setDepth(15);

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
  }

  createInventoryModal() {
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
  }

  createDictionaryModal() {
    const modalBackground = this.add.graphics();
    modalBackground.fillStyle(0x000000, 0.9);
    modalBackground.fillRoundedRect(0, 0, 720, 440, 18);
    modalBackground.lineStyle(3, 0xffffff, 0.45);
    modalBackground.strokeRoundedRect(0, 0, 720, 440, 18);

    const modalTitle = this.add.text(32, 28, 'Dictionnaire', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#ffffff'
    });

    const closeButton = this.add
      .text(628, 28, 'Fermer', {
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

    closeButton.on('pointerdown', () => {
      this.closeDictionary();
    });

    this.dictionaryListContainer = this.add.container(36, 96);
    this.dictionaryDetailText = this.add.text(300, 104, 'Sélectionnez un mot.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      wordWrap: {
        width: 380
      }
    });

    this.dictionaryModal = this.add.container(280, 140, [
      modalBackground,
      modalTitle,
      closeButton,
      this.dictionaryListContainer,
      this.dictionaryDetailText
    ]);
    this.dictionaryModal.setVisible(false);
    this.dictionaryModal.setDepth(30);
  }

  createNotificationText() {
    this.notificationText = this.add
      .text(640, 470, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: {
          x: 14,
          y: 10
        }
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(25);
  }

  spawnExplorationPoints() {
    const dialogueEntries = Object.entries(this.dialoguesData).filter(([id, node]) => {
      return node.level === this.levelId || id.startsWith(`${this.levelId}_`);
    });

    const positions = [
      { x: 420, y: 310 },
      { x: 640, y: 350 },
      { x: 860, y: 310 },
      { x: 540, y: 420 },
      { x: 760, y: 420 }
    ];

    dialogueEntries.forEach(([nodeId, node], index) => {
      const position = positions[index % positions.length];
      const npcImage = this.add.image(0, 0, 'npc_sprite').setDisplaySize(96, 96);
      const npcLabel = this.add
        .text(0, 70, node.speaker ?? 'NPC', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#00000099',
          padding: {
            x: 8,
            y: 5
          }
        })
        .setOrigin(0.5);

      const npcContainer = this.add.container(position.x, position.y, [npcImage, npcLabel]);
      npcContainer.setSize(140, 160);
      npcContainer.setInteractive(new Phaser.Geom.Rectangle(-70, -70, 140, 160), Phaser.Geom.Rectangle.Contains);

      npcContainer.on('pointerdown', () => {
        this.showDialogue(nodeId);
      });
    });

    if (dialogueEntries.length === 0) {
      this.showNotification(`Aucune donnée de dialogue pour ${this.levelId}.`);
    }
  }

  showDialogue(nodeId) {
    const node = this.dialoguesData[nodeId];

    if (!node) {
      console.warn(`Dialogue node not found: ${nodeId}`);
      return;
    }

    this.renderDialogueText(node.text ?? '');
    this.dialogueContainer.setVisible(true);
    this.playPopupTween(this.dialogueContainer);
    this.dialogueOpenedAt = this.time.now;

    if (node.gives_item) {
      this.addItemToInventory(node.gives_item);
    }
  }

  addItemToInventory(itemId) {
    if (this.inventory.some((item) => item.id === itemId)) {
      return;
    }

    const item = this.itemsData.find((candidate) => candidate.id === itemId);

    if (!item) {
      console.warn(`Item not found: ${itemId}`);
      return;
    }

    this.inventory.push({ ...item });
    this.showNotification(`Objet obtenu : ${item.name}`);
  }

  showNotification(message) {
    this.notificationText.setText(message);
    this.notificationText.setVisible(true);
    this.notificationText.setAlpha(0);
    this.notificationText.setScale(0.96);

    this.tweens.add({
      targets: this.notificationText,
      alpha: 1,
      scale: 1,
      duration: 160,
      ease: 'Quad.easeOut',
      yoyo: true,
      hold: 1200,
      onComplete: () => {
        this.notificationText.setVisible(false);
      }
    });
  }

  hideDialogue() {
    if (this.dialogueContainer) {
      this.dialogueContainer.setVisible(false);
    }
  }

  renderDialogueText(text) {
    const maxWidth = 1064;
    const lineHeight = 34;
    const baseStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px'
    };
    const vocabTerms = Object.keys(this.vocabData);

    this.dialogueText.setText('');
    this.dialogueTextContainer.removeAll(true);
    this.highlightedVocabTerm = vocabTerms.find((term) => this.textContainsTerm(text, term)) ?? null;

    const tokens = text.match(/\S+\s*/g) ?? [];
    let x = 0;
    let y = 0;

    tokens.forEach((token) => {
      const cleanToken = this.normalizeToken(token);
      const isVocabTerm = vocabTerms.includes(cleanToken);
      const tokenColor = isVocabTerm ? '#f4d35e' : '#ffffff';
      const tokenText = this.add.text(x, y, token, {
        ...baseStyle,
        color: tokenColor
      });

      if (x > 0 && x + tokenText.width > maxWidth) {
        x = 0;
        y += lineHeight;
        tokenText.setPosition(x, y);
      }

      this.dialogueTextContainer.add(tokenText);
      x += tokenText.width;
    });
  }

  textContainsTerm(text, term) {
    return text.toLocaleLowerCase('fr').includes(term.toLocaleLowerCase('fr'));
  }

  normalizeToken(token) {
    return token
      .trim()
      .toLocaleLowerCase('fr')
      .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
  }

  openDictionary(selectedTerm = null) {
    const terms = Object.keys(this.vocabData);

    this.dictionaryListContainer.removeAll(true);

    terms.forEach((term, index) => {
      const termButton = this.add
        .text(0, index * 46, term, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          color: term === selectedTerm ? '#1d3557' : '#ffffff',
          backgroundColor: term === selectedTerm ? '#f4d35e' : '#00000000',
          padding: {
            x: 8,
            y: 6
          }
        })
        .setInteractive({ useHandCursor: true });

      termButton.on('pointerdown', () => {
        this.showDictionaryEntry(term);
      });

      this.dictionaryListContainer.add(termButton);
    });

    if (terms.length === 0) {
      this.dictionaryDetailText.setText('Aucun mot chargé.');
    } else {
      this.showDictionaryEntry(selectedTerm ?? terms[0]);
    }

    this.dictionaryModal.setVisible(true);
    this.playPopupTween(this.dictionaryModal);
  }

  showDictionaryEntry(term) {
    const entry = this.vocabData[term];

    if (!entry) {
      this.dictionaryDetailText.setText('Mot introuvable.');
      return;
    }

    this.dictionaryDetailText.setText(`${term}\n\nDéfinition: ${entry.definition}\n\nExemple: ${entry.example}`);
  }

  closeDictionary() {
    if (this.dictionaryModal) {
      this.dictionaryModal.setVisible(false);
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
      const itemText = this.add.text(0, index * 64, `• ${item.name}\n  ${item.desc ?? ''}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        wordWrap: {
          width: 548
        }
      });

      this.inventoryItemsContainer.add(itemText);
    });

    this.inventoryContainer.setVisible(true);
    this.playPopupTween(this.inventoryContainer);
  }

  closeInventory() {
    if (this.inventoryContainer) {
      this.inventoryContainer.setVisible(false);
    }
  }

  playPopupTween(target) {
    target.setAlpha(0);
    target.setScale(0.96);

    this.tweens.add({
      targets: target,
      alpha: 1,
      scale: 1,
      duration: 160,
      ease: 'Back.easeOut'
    });
  }
}

