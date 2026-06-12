import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.levelId = data.levelId ?? 'mada';
    this.persuasionScore = data.score ?? 50;
    this.inventory = data.inventory ? [...data.inventory] : [];
    this.highlightedVocabTerm = null;
  }

  /**
   * Scale helper: Fit/Cover style for a target dimension without distortion.
   * - mode = 'cover' -> fills target; may crop
   * - mode = 'fit'   -> fully visible; may leave letterboxing
   */
  applyBackgroundCoverScale(displayObj, targetW, targetH) {
    const texW = displayObj.width;
    const texH = displayObj.height;
    if (!texW || !texH) return displayObj;

    const scaleX = targetW / texW;
    const scaleY = targetH / texH;
    const scale = Math.max(scaleX, scaleY); // cover

    displayObj.setScale(scale);
    return displayObj;
  }

  getLevelAssets() {
    // Background images in public/assets
    // - bg_mada.png
    // - bg_quebec.png
    // NPC images
    // - npc_lamtac.jpg (but requirement says npc_lamtac.png; keep key consistent with preload)
    // - npc_mada.jpg
    // - npc_mayor.jpg (may not exist)
    // Game currently needs to work with preloaded keys; so we map to existing preloader keys

    if (this.levelId === 'quebec') {
      return {
        bgKey: 'bg_quebec',
        npcKeys: ['npc_mayor', 'npc_mayor', 'npc_mayor'], // fallback
        defaultNpcKey: 'npc_mayor',
        npcVariantCount: 1
      };
    }

    // mada default
    return {
      bgKey: 'bg_mada',
      npcKeys: ['npc_mada', 'npc_lamtac', 'npc_lamtac'],
      defaultNpcKey: 'npc_mada',
      npcVariantCount: 1
    };
  }

  create() {
    // 1. Fade in from MapScene
    this.cameras.main.fadeIn(800, 0, 0, 0);

    this.itemsData = this.cache.json.get('items') ?? [];
    this.dialoguesData = this.cache.json.get('dialogues') ?? {};
    this.vocabData = this.cache.json.get('vocab') ?? {};

    // 2. Background: fit/cover for 1280x720
    const targetW = 1280;
    const targetH = 720;
    const { bgKey } = this.getLevelAssets();

    const bg = this.add.image(640, 360, bgKey).setDepth(-1);
    this.applyBackgroundCoverScale(bg, targetW, targetH);

    // 3. Top Bar
    this.add.rectangle(640, 40, 1280, 80, 0x000000, 0.75).setDepth(10);
    this.add.text(640, 40, `📍 Mission: ${this.levelId === 'quebec' ? 'Québec' : 'Madagascar'}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      color: '#f4d35e',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(11);

    this.createTopBar();
    this.createDialogueBox();
    this.createInventoryModal();
    this.createDictionaryModal();
    this.createNotificationText();

    // 4. Spawn NPCs (position + asset mapping by levelId)
    this.spawnNPCs();
  }

  spawnNPCs() {
    const { defaultNpcKey } = this.getLevelAssets();

    // Keep original dialogue selection behavior
    const dialogueEntries = Object.entries(this.dialoguesData).filter(([id]) => id.startsWith(`${this.levelId}_`));

    // Fake data if JSON missing
    if (dialogueEntries.length === 0) {
      dialogueEntries.push([`${this.levelId}_test`, { speaker: 'Villageois', text: 'Sauvez notre forêt, s\'il vous plaît!' }]);
    }

    // Better spacing & safe-zone layout for 1280x720
    const leftX = 360;
    const rightX = 920;
    const baseY = 470;

    const npcPositions = [
      { x: leftX, y: baseY },
      { x: rightX, y: baseY }
    ];

    dialogueEntries.forEach(([nodeId, node], index) => {
      const pos = npcPositions[index % npcPositions.length];

      // Determine NPC asset by levelId
      let npcKey = defaultNpcKey;
      if (this.levelId === 'quebec') npcKey = 'npc_mayor';
      if (this.levelId === 'mada') npcKey = 'npc_lamtac';

      // Fallback if key not available in cache
      // (Phaser will show blank texture if key missing; so we guard by trying known keys in order)
      const candidates = [];
      if (this.levelId === 'quebec') candidates.push('npc_mayor');
      if (this.levelId === 'mada') candidates.push('npc_lamtac', 'npc_mada');
      candidates.push(defaultNpcKey);

      npcKey = candidates.find((k) => this.textures.exists(k)) ?? defaultNpcKey;

      const npcImage = this.add.image(pos.x, pos.y - 150, npcKey);

      // Auto scale to a consistent on-screen size (no distortion)
      if (npcImage.height > 0) {
        const targetHeight = 420;
        npcImage.setScale(targetHeight / npcImage.height);
      } else {
        npcImage.setDisplaySize(200, 420);
      }
      npcImage.setDepth(6);

      const speakerY = pos.y + 105;
      const npcLabel = this.add.text(pos.x, speakerY, node.speaker ?? 'Habitant', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        backgroundColor: '#000000cc',
        padding: { x: 12, y: 6 }
      }).setOrigin(0.5);
      npcLabel.setDepth(7);

      // Container: click target + tween
      const npcContainer = this.add.container(pos.x, pos.y - 150, [npcImage, npcLabel]);
      npcContainer.setDepth(6);
      npcContainer.setInteractive({ useHandCursor: true, hitArea: npcImage });

      this.tweens.add({
        targets: npcContainer,
        y: (pos.y - 150) - 18,
        duration: 2200 + index * 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      npcContainer.on('pointerdown', () => {
        // Keep original behavior for dialogue rendering and item granting
        this.renderDialogueText(node.text ?? '', node.speaker ?? 'NPC');
        this.dialogueContainer.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.dialogueContainer, alpha: 1, duration: 250 });
        if (node.gives_item) this.addItemToInventory(node.gives_item);
      });
    });
  }

  // --------- UI (keep existing systems: dictionary, inventory, vocab parsing, notifications) ---------

  createDialogueBox() {
    // Safe zone: above bottom UI, avoid overlapping with bottom area
    const boxW = 1120;
    const boxH = 220;
    const centerX = 640;
    const centerY = 630; // bottom-friendly

    this.dialogueContainer = this.add.container(0, 0).setVisible(false).setDepth(20);

    const overlay = this.add.rectangle(centerX, centerY, boxW, boxH, 0x000000, 0.35).setInteractive();

    // Rounded background box
    const bgBox = this.add.graphics();
    bgBox.fillStyle(0x000000, 0.82);
    bgBox.fillRoundedRect(centerX - boxW / 2 + 40, centerY - 80, boxW - 80, 140, 16);
    bgBox.lineStyle(3, 0xf4d35e, 1);
    bgBox.strokeRoundedRect(centerX - boxW / 2 + 40, centerY - 80, boxW - 80, 140, 16);

    // Speaker tag
    this.speakerText = this.add.text(centerX - boxW / 2 + 70, centerY - 60, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '26px',
      color: '#1d3557',
      backgroundColor: '#f4d35e',
      padding: { x: 15, y: 8 },
      fontStyle: 'bold'
    });

    this.dialogueTextContainer = this.add.container(centerX - boxW / 2 + 60, centerY - 25);

    this.dialogueContainer.add([overlay, bgBox, this.speakerText, this.dialogueTextContainer]);

    overlay.on('pointerdown', () => {
      this.tweens.add({
        targets: this.dialogueContainer,
        alpha: 0,
        duration: 180,
        onComplete: () => this.dialogueContainer.setVisible(false)
      });
    });
  }

  renderDialogueText(text, speaker = 'NPC') {
    // Fix parameter order from original call site
    this.speakerText.setText(String(speaker ?? 'NPC').toUpperCase());
    this.dialogueTextContainer.removeAll(true);

    const vocabTerms = Object.keys(this.vocabData);
    this.highlightedVocabTerm = vocabTerms.find((term) => String(text).toLowerCase().includes(term.toLowerCase())) ?? null;

    let x = 0;
    let y = 0;
    const maxWidth = 940;

    (String(text).match(/\S+\s*/g) ?? []).forEach((token) => {
      const cleanToken = token.trim().toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
      const isVocab = vocabTerms.includes(cleanToken);

      const t = this.add.text(x, y, token, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        color: isVocab ? '#f4d35e' : '#ffffff'
      });

      if (x > 0 && x + t.width > maxWidth) {
        x = 0;
        y += 34;
        t.setPosition(x, y);
      }

      this.dialogueTextContainer.add(t);
      x += t.width;
    });
  }

  createTopBar() {
    const dictionaryButton = this.add.text(24, 24, '📖 Dictionnaire', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: { x: 14, y: 10 }
    }).setInteractive({ useHandCursor: true }).setDepth(11);

    dictionaryButton.on('pointerdown', () => {
      this.openDictionary(this.highlightedVocabTerm);
    });

    this.scoreText = this.add.text(24, 86, `Persuasion Score: ${this.persuasionScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: { x: 12, y: 8 }
    }).setDepth(11);

    const inventoryButton = this.add.text(1060, 24, '🎒 Inventaire', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: { x: 14, y: 10 }
    }).setInteractive({ useHandCursor: true }).setDepth(11);

    inventoryButton.on('pointerdown', () => {
      this.openInventory();
    });
  }

  addItemToInventory(itemId) {
    if (this.inventory.some((i) => i.id === itemId)) return;
    const item = this.itemsData.find((c) => c.id === itemId);
    if (item) {
      this.inventory.push({ ...item });
      this.showNotification(`✅ Preuve obtenue : ${item.name}`);
    }
  }

  createNotificationText() {
    this.notificationText = this.add.text(640, 260, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#00ff00',
      backgroundColor: '#000000dd',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(30);
  }

  showNotification(msg) {
    this.notificationText.setText(msg).setVisible(true).setAlpha(0).setScale(0.8);
    this.tweens.add({
      targets: this.notificationText,
      alpha: 1,
      scale: 1,
      duration: 200,
      yoyo: true,
      hold: 1500,
      onComplete: () => {
        this.notificationText.setVisible(false);
      }
    });
  }

  createInventoryModal() {
    const bg = this.add.rectangle(330, 180, 700, 470, 0x000000, 0.92).setStrokeStyle(3, 0xffffff);
    const title = this.add.text(60, 130, '🎒 Inventaire des preuves', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    const closeBtn = this.add.text(960, 130, 'Fermer', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#a33a3a',
      padding: { x: 12, y: 8 }
    }).setInteractive({ useHandCursor: true });

    this.inventoryItemsContainer = this.add.container(60, 210);
    this.inventoryContainer = this.add.container(0, 0, [bg, title, closeBtn, this.inventoryItemsContainer])
      .setVisible(false)
      .setDepth(40);

    closeBtn.on('pointerdown', () => {
      this.inventoryContainer.setVisible(false);
    });
  }

  openInventory() {
    this.inventoryItemsContainer.removeAll(true);
    if (this.inventory.length === 0) {
      this.inventoryItemsContainer.add(this.add.text(0, 0, 'Aucune preuve collectée.', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#dddddd'
      }));
    } else {
      this.inventory.forEach((item, i) => {
        this.inventoryItemsContainer.add(
          this.add.text(0, i * 62, `• ${item.name} : ${item.desc ?? ''}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            wordWrap: { width: 620 }
          })
        );
      });
    }
    this.inventoryContainer.setVisible(true);
  }

  createDictionaryModal() {
    const bg = this.add.rectangle(340, 220, 820, 520, 0x000000, 0.92).setStrokeStyle(3, 0xffffff);
    const title = this.add.text(90, 140, '📖 Dictionnaire Express', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '34px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    const closeBtn = this.add.text(865, 140, 'Fermer', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#a33a3a',
      padding: { x: 12, y: 8 }
    }).setInteractive({ useHandCursor: true });

    this.dictionaryListContainer = this.add.container(70, 210);
    this.dictionaryDetailText = this.add.text(460, 250, 'Sélectionnez un mot à gauche.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      wordWrap: { width: 320 }
    });

    this.dictionaryModal = this.add.container(0, 0, [bg, title, closeBtn, this.dictionaryListContainer, this.dictionaryDetailText])
      .setVisible(false)
      .setDepth(40);

    closeBtn.on('pointerdown', () => {
      this.dictionaryModal.setVisible(false);
    });
  }

  openDictionary(selectedTerm = null) {
    this.dictionaryListContainer.removeAll(true);
    const terms = Object.keys(this.vocabData);

    terms.forEach((term, index) => {
      const btn = this.add.text(0, index * 46, term, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: term === selectedTerm ? '#f4d35e' : '#ffffff',
        fontStyle: term === selectedTerm ? 'bold' : 'normal'
      }).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => {
        const entry = this.vocabData[term];
        this.dictionaryDetailText.setText(`${term}\n\nDéfinition:\n${entry.definition}\n\nExemple:\n${entry.example}`);
      });

      this.dictionaryListContainer.add(btn);
    });

    if (selectedTerm && this.vocabData[selectedTerm]) {
      const entry = this.vocabData[selectedTerm];
      this.dictionaryDetailText.setText(`${selectedTerm}\n\nDéfinition:\n${entry.definition}\n\nExemple:\n${entry.example}`);
    }

    this.dictionaryModal.setVisible(true);
  }
}

