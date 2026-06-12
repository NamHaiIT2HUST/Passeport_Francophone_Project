import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {

  constructor() {
    super('IntroScene');
  }

  create() {
    // ============================================
    // PHAN CANH 1: VAN PHONG LIEN HOP QUOC (0s - 10s)
    // ============================================

    // Background - Van phong lam viec hien dai
    const bg = this.add.image(640, 360, 'bg_office');
    this.fitImageToScreen(bg);
    bg.setDepth(0);

    // Nhan vat - Le Truong phong (dat sau ban lam viec)
    const boss = this.add.image(640, 340, 'npc_manager');
    boss.setScale(0.35);
    boss.setDepth(1);

    // Animation: Truong phong di chuyen nhe (mo phong dang noi chuyen)
    this.tweens.add({
      targets: boss,
      y: 335,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Audio: Giong doc tieng Phap
    try {
      this.sound.play('intro_voice');
    } catch (e) {
      console.warn('Audio missing - intro_voice');
    }

    // Subtitle - Phu de tieng Phap o 1/3 duoi man hinh
    const subtitleY = 580;
    const subtitleBg = this.add.rectangle(640, subtitleY, 1280, 180, 0x000000, 0.8);
    subtitleBg.setDepth(10);

    const subtitleText = this.add.text(640, subtitleY, '', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 1200 }
    }).setOrigin(0.5).setDepth(11);

    // Typewriter effect cho subtitle
    const fullText = 'Bienvenue à votre stage aux Nations Unies. Vous trouverez ci-joint le plan de travail de ce stage.';
    let charIndex = 0;
    const typewriterTimer = this.time.addEvent({
      delay: 60,
      callback: () => {
        if (charIndex < fullText.length) {
          subtitleText.setText(fullText.substring(0, charIndex + 1));
          charIndex++;
        } else {
          typewriterTimer.remove();
        }
      },
      repeat: fullText.length - 1
    });

    // ============================================
    // PHAN CANH 2: BAN GIAO NHIEM VU (10s - 15s)
    // ============================================

    this.time.delayedCall(10000, () => {
      // Xoa subtitle cu
      subtitleText.destroy();
      subtitleBg.destroy();

      // Tao to giay "Plan de travail"
      const paperWidth = 600;
      const paperHeight = 400;
      const paperBg = this.add.rectangle(640, 900, paperWidth, paperHeight, 0xfffdd0);
      paperBg.setStrokeStyle(3, 0x555555);
      paperBg.setDepth(20);

      const paperContent = this.add.text(640, 900,
        `STATUT : Stagiaire

MISSION PRINCIPALE :
Rédiger une nouvelle loi pour la protection
de l'environnement (ODD 15)
et des institutions pacifiques (ODD 16)

OBJECTIFS SPÉCIFIQUES :
• Voyager dans les pays de la Francophonie
  en alerte environnementale/sociale
• Enquêter, collecter des preuves
  et écouter les citoyens
• Organiser une conférence de médiation
  pour résoudre les conflits`,
        {
          fontFamily: 'Georgia',
          fontSize: '18px',
          color: '#1a1a2e',
          align: 'center',
          lineSpacing: 6,
          wordWrap: { width: 520 }
        }
      ).setOrigin(0.5).setDepth(21);

      // Animation: To giay truot len tu duoi man hinh
      this.tweens.add({
        targets: [paperBg, paperContent],
        y: 360,
        duration: 800,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Hien nut "Suivant" sau khi to giay truot len xong
          // Tao rectangle interactive lam nut bam
          const nextBtnBg = this.add.rectangle(640, 620, 180, 55, 0xf4d35e);
          nextBtnBg.setStrokeStyle(2, 0xe6c22f);
          nextBtnBg.setInteractive({ useHandCursor: true });
          nextBtnBg.setDepth(25);

          const nextBtnText = this.add.text(640, 620, 'Suivant ⏭', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#1a1a2e',
            fontStyle: 'bold'
          }).setOrigin(0.5).setDepth(26);

          // Animation: Nut nhap nhay (alpha tween)
          this.tweens.add({
            targets: [nextBtnBg, nextBtnText],
            alpha: 0.6,
            duration: 700,
            yoyo: true,
            repeat: -1
          });

          // Xu ly click vao nut "Suivant"
          nextBtnBg.on('pointerdown', () => {
            console.log('Nut Suivante duoc click!');
            // Ngung animation nhap nhay
            this.tweens.killTweensOf([nextBtnBg, nextBtnText]);

            // To giay va nut truot di va chuyen canh sang MapScene
            this.tweens.add({
              targets: [paperBg, paperContent, nextBtnBg, nextBtnText],
              x: 1400,
              duration: 500,
              ease: 'Power2.easeIn',
              onComplete: () => {
                console.log('Dang chuyen sang MapScene...');
                this.scene.start('MapScene');
              }
            });
          });
        }
      });
    });
  }

  /**
   * Helper: Fit image to screen while maintaining aspect ratio (cover mode)
   */
  fitImageToScreen(image) {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const imgWidth = image.width;
    const imgHeight = image.height;

    const scaleX = gameWidth / imgWidth;
    const scaleY = gameHeight / imgHeight;
    const scale = Math.max(scaleX, scaleY);

    image.setScale(scale);
  }
}