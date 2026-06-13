import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {

  constructor() {
    super('MapScene');
  }

  create() {
    console.log('MapScene da duoc khoi tao!');
    // ============================================
    // PHAN CANH 3: MO BAN DO PHAP NGU (18s - 25s)
    // ============================================

    // Background - Ban do the gioi
    const bgMap = this.add.image(640, 360, 'bg_map');
    this.fitImageToScreen(bgMap);
    bgMap.setDepth(0);

    // Vi tri Madagascar tren ban do (theo toa do yeu cau)
    const madaX = 850;
    const madaY = 480;

    // Tao vung zone tang hinh (alpha: 0) tai vi tri Madagascar
    const clickZone = this.add.zone(madaX, madaY, 120, 120)
      .setInteractive({ useHandCursor: true })
      .setDepth(1);

    // Hieu ung visual de nguoi choi biet vi tri click
    // Vong pulse (hieu ung lan truyen)
    const pulseRing = this.add.circle(madaX, madaY, 30, 0xff0000, 0);
    pulseRing.setStrokeStyle(3, 0xff4444, 0.8);
    pulseRing.setDepth(2);

    this.tweens.add({
      targets: pulseRing,
      scale: 4,
      alpha: 0,
      duration: 1500,
      repeat: -1,
      ease: 'Sine.easeOut'
    });

    // Vung mau do nhe de danh dau (se bien mat khi hover)
    const marker = this.add.circle(madaX, madaY, 25, 0xff0000, 0.3);
    marker.setDepth(2);

    this.tweens.add({
      targets: marker,
      alpha: 0.1,
      scale: 1.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Modern tooltip for Madagascar label
    const madagascarLabel = this.add.text(madaX, madaY + 60, 'Madagascar', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#F4D35E',
      backgroundColor: '#1D3557',
      padding: { x: 12, y: 8 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(3);

    // Subtle pulse animation for the label
    this.tweens.add({
      targets: madagascarLabel,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Sleek notification banner with rounded red background
    const guideText = this.add.text(640, 60, 'Sélectionnez cette zone', {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#E63946',
      padding: { x: 24, y: 12 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(3);

    // Animation: Guide text xuat hien
    guideText.y = -50;
    this.tweens.add({
      targets: guideText,
      y: 60,
      duration: 600,
      ease: 'Back.easeOut',
      delay: 300
    });

    // Xu ly click vao vung Madagascar (chuyen sang boi canh Quebec)
    clickZone.on('pointerdown', () => {
      // Zoom vao Madagascar
      this.cameras.main.pan(madaX, madaY, 600);
      this.cameras.main.zoomTo(3, 800);

      // Fade to black va chuyen sang GameScene voi levelId 'quebec'
      this.time.delayedCall(800, () => {
        this.cameras.main.fadeOut(600, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('GameScene', {
            levelId: 'quebec',
            score: 50,
            inventory: []
          });
        });
      });
    });

    // Hover effect
    clickZone.on('pointerover', () => {
      this.tweens.add({
        targets: marker,
        scale: 2,
        alpha: 0.6,
        duration: 300
      });
    });

    clickZone.on('pointerout', () => {
      this.tweens.add({
        targets: marker,
        scale: 1.3,
        alpha: 0.3,
        duration: 300
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