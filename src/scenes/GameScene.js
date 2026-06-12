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

  create() {
    // Fade in từ MapScene
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Kiểm tra levelId để chạy luồng phù hợp
    if (this.levelId === 'quebec') {
      this.createQuebecScene();
    } else {
      this.createMadagascarScene();
    }
  }

  // ============================================
  // LUONG CHO BOI CANH QUEBEC (3 GIAI DOAN)
  // ============================================
  createQuebecScene() {
    // ============================================
    // GIAI DOAN 1: DI CHUYEN VA TIM KIEM (0s - 12s)
    // ============================================

    // Load anh nen bg_quebec - dat o giua man hinh
    const bgQuebec = this.add.image(640, 360, 'bg_quebec');

    // Tinh toan ti le scale sao cho chieu cao vua khit 720px
    const scale = 720 / bgQuebec.height;
    bgQuebec.setScale(scale);
    bgQuebec.setDepth(0);

    // Cai dat gioi han camera - dat bounds rong hon de co the pan
    const boundsWidth = Math.max(bgQuebec.displayWidth, 2000); // Toi thieu 2000px de co khoang pan
    this.cameras.main.setBounds(0, 0, boundsWidth, 720);

    // Reset camera ve vi tri ban dau (ben trai)
    this.cameras.main.scrollX = 0;

    // Phat am thanh moi truong
    try {
      this.ambientWind = this.sound.add('ambient_wind', { loop: true, volume: 0.5 });
      this.ambientWind.play();

      this.footstep = this.sound.add('footstep', { loop: true, volume: 0.7 });
      this.footstep.play();
    } catch (e) {
      console.warn('Audio missing - ambient_wind or footstep');
    }

    // ============================================
    // GIAI DOAN 2: TUONG TAC VOI NPC (sau 12s)
    // ============================================

    // Sau 12 giay, hien NPC va cho phep tuong tac
    this.time.delayedCall(12000, () => {
      // Dat NPC o vi tri xa ben phai - se duoc phat hien khi camera pan
      const npcX = boundsWidth - 300; // Gan cuoi bounds
      const npcY = 420;
      const npc = this.add.image(npcX, npcY, 'npc_quebec_resident');

      // Auto-scale NPC
      if (npc.height > 0) {
        npc.setScale(400 / npc.height);
      }
      npc.setDepth(1);

      // Tween nhe nhang (tho)
      this.tweens.add({
        targets: npc,
        y: npcY - 10,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Pan camera den vi tri co NPC
      this.cameras.main.pan(npcX, npcY, 1500, 'Power2');
      this.cameras.main.zoomTo(1.1, 1500, 'Power2');

      // Sau khi pan xong, cho phep click vao NPC
      this.time.delayedCall(1500, () => {
        // Bat tinh nang tuong tac cho NPC
        npc.setInteractive({ useHandCursor: true });

        // Chi cho phep click mot lan
        let hasClicked = false;

        npc.on('pointerdown', () => {
          if (hasClicked) return; // Ngan khong cho click nhieu lan
          hasClicked = true;

          // Tat tieng footstep
          if (this.footstep) {
            this.footstep.stop();
          }

          // Phat am thanh click_ui
          try {
            this.sound.play('click_ui');
          } catch (e) {
            console.warn('Audio missing - click_ui');
          }

          // Tat tween tho cua NPC
          this.tweens.killTweensOf(npc);

          // Hien vong tron tieu diem (Target Ring) bang graphics
          const targetRing = this.add.graphics();
          targetRing.lineStyle(4, 0xf4d35e, 1);
          targetRing.strokeCircle(npcX, npcY, 50);
          targetRing.setDepth(10);

          // Animation: Target ring nhap nhay phat sang
          this.tweens.add({
            targets: targetRing,
            alpha: 0.3,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          // Zoom them vao NPC
          this.cameras.main.zoomTo(1.3, 800, 'Power2');

          // Sau 1300ms -> hien Dialogue Box
          this.time.delayedCall(1300, () => {
            this.showQuebecDialogueBox();
          });
        });
      });
    });
  }

  // ============================================
  // GIAI DOAN 3: HOP THOAI MANH MOI (15s - 20s)
  // ============================================
  showQuebecDialogueBox() {
    // Tao container co dinh voi camera (setScrollFactor(0))
    const dialogueContainer = this.add.container(0, 0);
    dialogueContainer.setDepth(20);
    dialogueContainer.setScrollFactor(0);

    // Ve khung hoi thoai bo goc bang Graphics
    const graphics = this.add.graphics();
    const boxWidth = 1000;
    const boxHeight = 160;
    const boxX = (1280 - boxWidth) / 2;
    const boxY = 720 - boxHeight - 20;

    // Ve rounded rectangle
    graphics.fillStyle(0x000000, 0.85);
    graphics.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 16);
    graphics.lineStyle(3, 0xf4d35e, 1);
    graphics.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 16);

    dialogueContainer.add(graphics);

    // Hien ten hien thi: 'Expert Local'
    const nameTag = this.add.text(
      boxX + 20,
      boxY - 30,
      'Expert Local',
      {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#f4d35e',
        fontStyle: 'bold',
        backgroundColor: '#000000cc',
        padding: { x: 12, y: 6 }
      }
    ).setScrollFactor(0).setDepth(21);

    dialogueContainer.add(nameTag);

    // Doi tuong text cho hoi thoai
    const dialogueText = this.add.text(
      boxX + 30,
      boxY + 30,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        wordWrap: { width: boxWidth - 60 }
      }
    ).setScrollFactor(0).setDepth(21);

    dialogueContainer.add(dialogueText);

    // Typewriter effect: "Charon habite à gauche de l'église."
    const fullText = "Charon habite à gauche de l'église.";
    let charIndex = 0;

    const typewriterTimer = this.time.addEvent({
      delay: 35,
      callback: () => {
        if (charIndex < fullText.length) {
          dialogueText.setText(fullText.substring(0, charIndex + 1));
          charIndex++;
        } else {
          typewriterTimer.remove();
        }
      },
      repeat: fullText.length - 1
    });

    // Click de complete typewriter hoac close dialogue
    dialogueContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1280, 720), Phaser.Geom.Rectangle.Contains);
    dialogueContainer.on('pointerdown', () => {
      if (charIndex < fullText.length) {
        dialogueText.setText(fullText);
        typewriterTimer.remove();
      } else {
        this.tweens.add({
          targets: dialogueContainer,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            dialogueContainer.destroy();
          }
        });
      }
    });
  }

  // ============================================
  // LUONG CHO BOI CANH MADAGASCAR (CU)
  // ============================================
  createMadagascarScene() {
    this.itemsData = this.cache.json.get('items') ?? [];
    this.dialoguesData = this.cache.json.get('dialogues') ?? {};
    this.vocabData = this.cache.json.get('vocab') ?? {};

    // Hình nền tự động căn chỉnh
    const bgKey = this.levelId === 'mada' ? 'bg_mada' : 'bg_quebec';
    const bg = this.add.image(640, 360, bgKey).setDepth(-1);
    bg.setScale(Math.max(1280 / bg.width, 720 / bg.height));

    // Thanh Top Bar
    this.add.rectangle(640, 40, 1280, 80, 0x000000, 0.75).setDepth(10);
    this.add.text(640, 40, `📍 Mission: Madagascar (Forêt de Baobabs)`, {
      fontFamily: 'Arial, sans-serif', fontSize: '26px', color: '#f4d35e', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(11);

    this.createTopBar();
    this.createDialogueBox();
    this.createInventoryModal();
    this.createDictionaryModal();
    this.createNotificationText();

    // Sinh NPC cô gái
    this.spawnNPCs();
  }

  spawnNPCs() {
    const npcKey = 'npc_mada';
    const dialogueEntries = Object.entries(this.dialoguesData).filter(([id]) => id.startsWith(`${this.levelId}_`));

    // Fake 1 hội thoại nếu file JSON chưa có data
    if (dialogueEntries.length === 0) {
      dialogueEntries.push(["mada_test", { speaker: "Villageoise", text: "Sauvez notre forêt, s'il vous plaît!" }]);
    }

    dialogueEntries.forEach(([nodeId, node], index) => {
      const npcImage = this.add.image(0, 0, npcKey);

      // Auto-scale chiều cao NPC lên 420px
      if (npcImage.height > 0) {
        npcImage.setScale(420 / npcImage.height);
      } else {
        npcImage.setDisplaySize(200, 420);
      }

      const npcLabel = this.add.text(0, 230, node.speaker ?? 'Habitant', {
        fontFamily: 'Arial, sans-serif', fontSize: '22px', color: '#ffffff',
        backgroundColor: '#000000cc', padding: { x: 12, y: 6 }
      }).setOrigin(0.5);

      const npcContainer = this.add.container(640, 400, [npcImage, npcLabel])
        .setDepth(5).setSize(250, 500).setInteractive({ useHandCursor: true });

      // Hiệu ứng thở
      this.tweens.add({
        targets: npcContainer, y: 380, duration: 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });

      npcContainer.on('pointerdown', () => {
        this.renderDialogueText(node.speaker ?? 'NPC', node.text ?? '');
        this.dialogueContainer.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.dialogueContainer, alpha: 1, duration: 300 });
        if (node.gives_item) this.addItemToInventory(node.gives_item);
      });
    });
  }

  createDialogueBox() {
    this.dialogueContainer = this.add.container(0, 0).setVisible(false).setDepth(20);
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.4).setInteractive();

    const bgBox = this.add.graphics();
    bgBox.fillStyle(0x000000, 0.85);
    bgBox.fillRoundedRect(140, 500, 1000, 180, 16);
    bgBox.lineStyle(3, 0xf4d35e, 1);
    bgBox.strokeRoundedRect(140, 500, 1000, 180, 16);

    this.speakerText = this.add.text(170, 475, '', {
      fontFamily: 'Arial, sans-serif', fontSize: '26px', color: '#1d3557',
      backgroundColor: '#f4d35e', padding: { x: 15, y: 8 }, fontStyle: 'bold'
    });

    this.dialogueTextContainer = this.add.container(170, 530);
    this.dialogueContainer.add([overlay, bgBox, this.speakerText, this.dialogueTextContainer]);

    overlay.on('pointerdown', () => {
      this.tweens.add({ targets: this.dialogueContainer, alpha: 0, duration: 200, onComplete: () => this.dialogueContainer.setVisible(false) });
    });
  }

  renderDialogueText(speaker, text) {
    this.speakerText.setText(speaker.toUpperCase());
    this.dialogueTextContainer.removeAll(true);
    const vocabTerms = Object.keys(this.vocabData);
    let x = 0, y = 0;
    this.highlightedVocabTerm = vocabTerms.find((term) => text.toLowerCase().includes(term.toLowerCase())) ?? null;

    (text.match(/\S+\s*/g) ?? []).forEach((token) => {
      const cleanToken = token.trim().toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
      const isVocab = vocabTerms.includes(cleanToken);
      const t = this.add.text(x, y, token, { fontFamily: 'Arial, sans-serif', fontSize: '28px', color: isVocab ? '#f4d35e' : '#ffffff' });
      if (x > 0 && x + t.width > 940) { x = 0; y += 40; t.setPosition(x, y); }
      this.dialogueTextContainer.add(t);
      x += t.width;
    });
  }

  createTopBar() {
    const dicBtn = this.add.text(30, 40, '📖 Dictionnaire', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', backgroundColor: '#1d3557', padding: { x: 15, y: 10 } }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true }).setDepth(11);
    dicBtn.on('pointerdown', () => this.openDictionary(this.highlightedVocabTerm));
    this.scoreText = this.add.text(30, 100, `⚖️ Score: ${this.persuasionScore}`, { fontFamily: 'Arial', fontSize: '26px', color: '#ffffff', backgroundColor: '#1d3557', padding: { x: 15, y: 10 } }).setOrigin(0, 0.5).setDepth(11);
    const invBtn = this.add.text(1250, 40, '🎒 Inventaire', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', backgroundColor: '#1d3557', padding: { x: 15, y: 10 } }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).setDepth(11);
    invBtn.on('pointerdown', () => this.openInventory());
  }

  addItemToInventory(itemId) {
    if (this.inventory.some((i) => i.id === itemId)) return;
    const item = this.itemsData.find((c) => c.id === itemId);
    if (item) {
      this.inventory.push({ ...item });
      this.showNotification(`✨ Preuve obtenue : ${item.name}`);
    }
  }

  createNotificationText() {
    this.notificationText = this.add.text(640, 250, '', { fontFamily: 'Arial', fontSize: '28px', color: '#00ff00', backgroundColor: '#000000dd', padding: { x: 25, y: 15 }, fontStyle: 'bold' }).setOrigin(0.5).setVisible(false).setDepth(30);
  }

  showNotification(msg) {
    this.notificationText.setText(msg).setVisible(true).setAlpha(0).setScale(0.5);
    this.tweens.add({ targets: this.notificationText, alpha: 1, scale: 1, duration: 300, ease: 'Back.easeOut' });
    this.time.delayedCall(2500, () => this.tweens.add({ targets: this.notificationText, alpha: 0, duration: 300, onComplete: () => this.notificationText.setVisible(false) }));
  }

  createInventoryModal() {
    const bg = this.add.rectangle(640, 360, 660, 460, 0x000000, 0.95).setStrokeStyle(3, 0xffffff);
    const title = this.add.text(340, 160, '🎒 Vos Preuves', { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', fontStyle: 'bold' });
    const closeBtn = this.add.text(920, 160, '✖', { fontFamily: 'Arial', fontSize: '28px', color: '#ff0000' }).setInteractive({ useHandCursor: true });
    this.inventoryItemsContainer = this.add.container(350, 230);
    this.inventoryContainer = this.add.container(0, 0, [bg, title, closeBtn, this.inventoryItemsContainer]).setVisible(false).setDepth(40);
    closeBtn.on('pointerdown', () => this.inventoryContainer.setVisible(false));
  }

  openInventory() {
    this.inventoryItemsContainer.removeAll(true);
    if (this.inventory.length === 0) {
      this.inventoryItemsContainer.add(this.add.text(0, 0, 'Vide.', { fontFamily: 'Arial', fontSize: '24px', color: '#777777' }));
    } else {
      this.inventory.forEach((item, i) => this.inventoryItemsContainer.add(this.add.text(0, i * 70, `• ${item.name}\n  ${item.desc ?? ''}`, { fontFamily: 'Arial', fontSize: '22px', color: '#f4d35e', wordWrap: { width: 560 } })));
    }
    this.inventoryContainer.setVisible(true).setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: this.inventoryContainer, alpha: 1, scale: 1, duration: 200 });
  }

  createDictionaryModal() {
    const bg = this.add.rectangle(640, 360, 800, 500, 0x000000, 0.95).setStrokeStyle(3, 0xffffff);
    const title = this.add.text(280, 140, '📖 Dictionnaire', { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff', fontStyle: 'bold' });
    const closeBtn = this.add.text(1000, 140, '✖', { fontFamily: 'Arial', fontSize: '28px', color: '#ff0000' }).setInteractive({ useHandCursor: true });
    this.dictionaryListContainer = this.add.container(280, 210);
    this.dictionaryDetailText = this.add.text(540, 210, 'Sélectionnez un mot.', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', wordWrap: { width: 460 }, lineHeight: 1.5 });
    this.dictionaryModal = this.add.container(0, 0, [bg, title, closeBtn, this.dictionaryListContainer, this.dictionaryDetailText]).setVisible(false).setDepth(40);
    closeBtn.on('pointerdown', () => this.dictionaryModal.setVisible(false));
  }

  openDictionary(selectedTerm = null) {
    this.dictionaryListContainer.removeAll(true);
    const terms = Object.keys(this.vocabData);
    terms.forEach((term, index) => {
      const isSelected = term === selectedTerm;
      const btn = this.add.text(0, index * 55, term, { fontFamily: 'Arial', fontSize: '24px', color: isSelected ? '#1d3557' : '#ffffff', backgroundColor: isSelected ? '#f4d35e' : 'transparent', padding: { x: 10, y: 8 } }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        const entry = this.vocabData[term];
        this.dictionaryDetailText.setText(`${term.toUpperCase()}\n\n📖 Définition:\n${entry.definition}\n\n💬 Exemple:\n${entry.example}`);
      });
      this.dictionaryListContainer.add(btn);
    });
    if (selectedTerm && this.vocabData[selectedTerm]) {
      const entry = this.vocabData[selectedTerm];
      this.dictionaryDetailText.setText(`${selectedTerm.toUpperCase()}\n\n📖 Définition:\n${entry.definition}\n\n💬 Exemple:\n${entry.example}`);
    }
    this.dictionaryModal.setVisible(true).setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: this.dictionaryModal, alpha: 1, scale: 1, duration: 200 });
  }
}