import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    // Phân cảnh 1 (0-10s): Video Trưởng phòng
    const introVideo = this.add.video(640, 360, 'intro_vid');
    introVideo.play(false); 
    introVideo.setDisplaySize(1280, 720);

    // Phụ đề tiếng Pháp
    this.add.text(640, 680, 'Bienvenue à votre stage aux Nations Unies. Voici votre plan de travail.', {
      fontFamily: 'Arial, sans-serif', fontSize: '26px', color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Phân cảnh 2 (10-15s): Tờ giấy trượt lên từ dưới
    // Vẽ tờ giấy ảo bằng code (Không cần dùng Canva luôn)
    const paper = this.add.graphics();
    paper.fillStyle(0xfffdd0, 1); // Màu giấy vàng nhạt
    paper.fillRect(340, 750, 600, 400); // Nằm tuốt dưới màn hình
    paper.lineStyle(4, 0x8b0000, 1);
    paper.strokeRect(340, 750, 600, 400);

    const paperText = this.add.text(640, 950, 
      "PLAN DE TRAVAIL - STAGIAIRE\n\n- Mission: Rédiger une loi (ODD 15, 16)\n- Enquêter, collecter des preuves\n- Organiser une table ronde", {
      fontFamily: 'Courier New, monospace', fontSize: '26px', color: '#000000', align: 'center', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Group giấy và chữ lại
    this.paperGroup = this.add.container(0, 0, [paperText]);

    // Hẹn giờ sau 3 giây, tờ giấy tự động trượt lên!
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: paper, y: -600, duration: 1000, ease: 'Power2' });
      this.tweens.add({ targets: this.paperGroup, y: -600, duration: 1000, ease: 'Power2' });
      
      // Hiện nút Suivant nhấp nháy
      skipBtn.setVisible(true);
    });

    // Nút Suivant nhấp nháy (Lúc đầu ẩn đi)
    const skipBtn = this.add.text(1150, 620, 'Suivant ⏭', {
      fontFamily: 'Arial, sans-serif', fontSize: '28px', color: '#1d3557', backgroundColor: '#f4d35e', padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    this.tweens.add({ targets: skipBtn, alpha: 0.5, duration: 500, yoyo: true, repeat: -1 });

    const goToMap = () => {
      introVideo.stop();
      this.scene.start('MapScene');
    };

    skipBtn.on('pointerdown', goToMap);
  }
}