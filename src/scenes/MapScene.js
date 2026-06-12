import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    // Hiện ảnh Bản đồ báo động (Vừa khít màn hình 1280x720)
    this.add.image(640, 360, 'bg_map').setDisplaySize(1280, 720);

    // Chữ hướng dẫn trên cùng
    this.add.text(640, 50, 'ALERTE MAXIMALE : Sélectionnez cette zone', {
      fontFamily: 'Arial, sans-serif', fontSize: '32px', color: '#ffffff',
      backgroundColor: '#cc0000', padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // TỌA ĐỘ MADAGASCAR TRÊN BẢN ĐỒ (Có thể sửa số x, y nếu nó lệch)
    const madaX = 850; 
    const madaY = 480;

    // Phân cảnh 3 (15-20s): Vòng tròn đỏ nhấp nháy báo động (Pulse Effect)
    const alertCircle = this.add.circle(madaX, madaY, 30, 0xff0000, 0.6);
    this.tweens.add({
      targets: alertCircle,
      scale: 2.5,     // Phình to ra
      alpha: 0,       // Mờ dần
      duration: 1000,
      repeat: -1      // Lặp lại mãi mãi
    });

    const madaDot = this.add.circle(madaX, madaY, 15, 0xff0000).setInteractive({ useHandCursor: true });
    this.add.text(madaX, madaY + 30, 'Madagascar', {
      fontFamily: 'Arial', fontSize: '20px', color: '#ffffff', backgroundColor: '#000000'
    }).setOrigin(0.5);

    // Phân cảnh 4: Click vào Madagascar -> Zoom in và chuyển cảnh vào Rừng
    madaDot.on('pointerdown', () => {
      this.cameras.main.pan(madaX, madaY, 1000, 'Power2'); // Camera lia tới
      this.cameras.main.zoomTo(3, 1000, 'Power2');         // Camera phóng to

      // Đợi 1 giây zoom xong thì bay vào GameScene
      this.time.delayedCall(1000, () => {
        this.scene.start('GameScene', { levelId: 'mada' });
      });
    });
  }
}