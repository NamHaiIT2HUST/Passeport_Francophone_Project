import Phaser from 'phaser';

export default class QuebecScene extends Phaser.Scene {

  constructor() {
    super('QuebecScene');
  }

  create() {
    // ============================================
    // PHASE 1: ENVIRONMENT & PANNING (0s - 12s)
    // ============================================

    // Set up bg_quebec - scale height to exactly 720px
    const bgQuebec = this.add.image(0, 360, 'bg_quebec');
    bgQuebec.setOrigin(0, 0.5);
    bgQuebec.setDisplaySize(bgQuebec.width * (720 / bgQuebec.height), 720);
    bgQuebec.setDepth(0);

    // Set camera bounds to match image width
    const bgWidth = bgQuebec.displayWidth;
    this.cameras.main.setBounds(0, 0, bgWidth, 720);

    // Play ambient sounds
    try {
      const ambientWind = this.sound.add('ambient_wind', { loop: true, volume: 0.5 });
      ambientWind.play();

      const footstep = this.sound.add('footstep', { loop: true, volume: 0.8 });
      footstep.play();

      // Store references for later
      this.ambientWind = ambientWind;
      this.footstep = footstep;
    } catch (e) {
      console.warn('Audio missing - ambient_wind or footstep');
    }

    // Place NPC slightly off-screen initially
    const npcX = 1400;
    const npcY = 400;
    const npc = this.add.image(npcX, npcY, 'npc_quebec_resident');
    npc.setDepth(1);

    // Auto-scale NPC to appropriate size (height ~400px)
    if (npc.height > 0) {
      npc.setScale(400 / npc.height);
    }

    // Floating animation (breathing effect)
    this.tweens.add({
      targets: npc,
      y: npcY - 15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Camera pan from left to right over 12 seconds
    const cameraPanTween = this.tweens.add({
      targets: this.cameras.main,
      scrollX: npcX - 640, // Center camera on NPC position
      duration: 12000,
      ease: 'Linear'
    });

    // ============================================
    // PHASE 2: INTERACTION TRIGGER (12s - 15s)
    // ============================================

    // Make NPC interactive
    npc.setInteractive({ useHandCursor: true });

    npc.on('pointerdown', () => {
      // Stop camera panning immediately
      cameraPanTween.pause();
      cameraPanTween.remove();

      // Stop footstep audio
      if (this.footstep) {
        this.footstep.stop();
      }

      // Play click UI sound
      try {
        this.sound.play('click_ui');
      } catch (e) {
        console.warn('Audio missing - click_ui');
      }

      // Spawn target_ring at NPC coordinates
      const targetRing = this.add.image(npcX, npcY, 'target_ring');
      targetRing.setDepth(10);
      targetRing.setScale(0.8);

      // Spin and pulse animation for target ring
      this.tweens.add({
        targets: targetRing,
        angle: 360,
        duration: 1000,
        repeat: -1,
        ease: 'Linear'
      });

      this.tweens.add({
        targets: targetRing,
        scale: 1.2,
        alpha: 0.6,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Cinematic camera focus on NPC
      this.cameras.main.pan(npcX, npcY, 800, 'Power2');
      this.cameras.main.zoomTo(1.3, 800, 'Power2');

      // Wait 500ms after zoom completes, then show dialogue
      this.time.delayedCall(1300, () => {
        this.showDialogueBox();
      });
    });
  }

  /**
   * PHASE 3: GRAPHICS DIALOGUE BOX & TYPEWRITER EFFECT (15s - 20s)
   */
  showDialogueBox() {
    // Create container fixed to camera (setScrollFactor(0))
    const dialogueContainer = this.add.container(0, 0);
    dialogueContainer.setDepth(20);
    dialogueContainer.setScrollFactor(0);

    // Draw rounded rectangle using Graphics
    const graphics = this.add.graphics();
    const boxWidth = 1000;
    const boxHeight = 160;
    const boxX = (1280 - boxWidth) / 2; // Center horizontally
    const boxY = 720 - boxHeight - 20; // 20px from bottom

    // Draw rounded rectangle
    graphics.fillStyle(0x000000, 0.85);
    graphics.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 16);
    graphics.lineStyle(3, 0xf4d35e, 1);
    graphics.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 16);

    dialogueContainer.add(graphics);

    // Add Name Tag: "Expert Local"
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

    // Dialogue text object
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

    // Typewriter effect
    const fullText = "Charon habite à gauche de l'église.";
    let charIndex = 0;

    const typewriterTimer = this.time.addEvent({
      delay: 30,
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

    // Click to close dialogue (optional)
    dialogueContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1280, 720), Phaser.Geom.Rectangle.Contains);
    dialogueContainer.on('pointerdown', () => {
      // Complete typewriter immediately if clicked
      if (charIndex < fullText.length) {
        dialogueText.setText(fullText);
        typewriterTimer.remove();
      } else {
        // Fade out and destroy
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
}