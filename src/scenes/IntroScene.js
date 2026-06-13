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

    // Subtitle - Sleeker subtitle bar at bottom third of screen
    const subtitleY = 580;
    const subtitleBg = this.add.rectangle(640, subtitleY, 1280, 180, 0x000000, 0.8);
    subtitleBg.setDepth(10);

    const subtitleText = this.add.text(640, subtitleY, '', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 1200 },
      lineSpacing: 10
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

      // Tao to giay "Plan de travail" - Professional paper styling with larger dimensions
      const paperWidth = 760;
      const paperHeight = 520;
      const paperBg = this.add.rectangle(260 + paperWidth / 2, 750, paperWidth, paperHeight, 0xFAFAFA);
      paperBg.setStrokeStyle(3, 0x1D3557);
      paperBg.setDepth(20);

      // Paper final position - centered on screen
      const paperFinalX = 640;
      const paperFinalY = 340;

      const paperContent = this.add.text(260 + paperWidth / 2, 750,
        `ORGANISATION DES NATIONS UNIES (ONU)
ORDRE DE MISSION DE PHASE
---
INFORMATIONS GÉNÉRALES
* Statut de la station : Station des Nations Unies
* Durée de la mission : Phase réglementaire
MISSION PRINCIPALE
Évaluer, recueillir des preuves et résoudre les crises environnementales et sociales (conformément aux objectifs ODD 15 et ODD 16) dans les pays de la Francophonie.
OBJECTIFS SPÉCIAUX ET DE DÉPLACEMENT
1. NUMÉRATION DU TERRAIN : Se rendre dans les pays à risque, mener des enquêtes et recueillir les avis des populations locales afin de constituer des « fiches de preuves ».
2. MÉDIAS : Participer à des simulations de médiation et en organiser afin de résoudre les différends entre les parties concernées.
3. PROPOSITION FINALE : Élaborer une proposition de loi relative à la protection de l'environnement et aux institutions pacifiques.
CRITÈRES DE VALIDATION PAR ÉTAPE :
Les stagiaires doivent retourner au Bureau des Nations Unies pour présenter et soumettre leur rapport de proposition finalisé et obtenir l'approbation formelle de leur superviseur.`,
        {
          fontFamily: 'Georgia',
          fontSize: '15px',
          color: '#111111',
          align: 'left',
          lineSpacing: 6,
          wordWrap: { width: 680 }
        }
      ).setOrigin(0.5).setDepth(21);

      // Animation: To giay truot len tu duoi man hinh
      this.tweens.add({
        targets: [paperBg, paperContent],
        x: paperFinalX,
        y: paperFinalY,
        duration: 800,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Hien nut "Suivant" o goc duoi ben phai man hinh (ngoai vung van ban)
          const nextBtnX = 1120;
          const nextBtnY = 640;

          const nextBtnBg = this.add.rectangle(nextBtnX, nextBtnY, 180, 55, 0xf4d35e);
          nextBtnBg.setStrokeStyle(2, 0xe6c22f);
          nextBtnBg.setInteractive({ useHandCursor: true });
          nextBtnBg.setDepth(25);

          const nextBtnText = this.add.text(nextBtnX, nextBtnY, 'Suivant ⏭', {
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