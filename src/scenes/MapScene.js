import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    this.add.image(640, 360, 'bg_map');

    this.add
      .text(640, 96, 'CARTE DU MONDE FRANCOPHONE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#00000099',
        padding: { x: 20, y: 10 }
      })
      .setOrigin(0.5);

    // Vẽ nút Madagascar
    this.createMissionButton(300, 280, '📍 Mission 1: Madagascar', 'mada');
    
    // Check xem Madagascar đã phá đảo chưa
    if (this.registry.get('mada_cleared')) {
        let madaStamp = this.add.text(300, 340, '✅ TAMPONNÉ', {
            fontFamily: 'Arial, sans-serif', fontSize: '24px', color: '#8fd694', fontStyle: 'bold', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        // Nếu chưa đóng dấu bao giờ thì chạy hiệu ứng "Giáng búa"
        if (!this.registry.get('mada_stamp_anim_done')) {
            madaStamp.setScale(4).setAlpha(0); // Bắt đầu to đùng và tàng hình
            this.tweens.add({
                targets: madaStamp,
                scale: 1, alpha: 1, duration: 400, ease: 'Bounce.easeOut' // Rơi xuống nảy lên
            });
            this.registry.set('mada_stamp_anim_done', true); // Đánh dấu là đã xem animation
        }
    }

    // Vẽ nút Quebec
    this.createMissionButton(820, 440, '📍 Mission 2: Québec', 'quebec');
    
    // Check xem Quebec đã phá đảo chưa
    if (this.registry.get('quebec_cleared')) {
        let quebecStamp = this.add.text(820, 500, '✅ TAMPONNÉ', {
            fontFamily: 'Arial, sans-serif', fontSize: '24px', color: '#8fd694', fontStyle: 'bold', backgroundColor: '#000000aa', padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Hiệu ứng giáng búa cho Quebec
        if (!this.registry.get('quebec_stamp_anim_done')) {
            quebecStamp.setScale(4).setAlpha(0);
            this.tweens.add({
                targets: quebecStamp,
                scale: 1, alpha: 1, duration: 400, ease: 'Bounce.easeOut'
            });
            this.registry.set('quebec_stamp_anim_done', true);
        }
    }
  } // <--- CHÍNH LÀ CÁI NGOẶC NÀY BỊ THIẾU NÈ!

  createMissionButton(x, y, label, levelId) {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        color: '#1d3557',
        backgroundColor: '#f4d35e',
        padding: {
          x: 18,
          y: 12
        }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', () => {
      this.scene.start('GameScene', {
        levelId
      });
    });
  }
}