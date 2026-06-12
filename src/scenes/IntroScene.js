import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    // 1. Phát video (căn giữa màn hình)
    const introVideo = this.add.video(640, 360, 'intro_vid');
    introVideo.play(false); 
    introVideo.setDisplaySize(1280, 720);

    // 2. Thêm phụ đề (Subtitle)
    this.add.text(640, 620, 'Bienvenue à votre stage aux Nations Unies...', {
      fontFamily: 'Arial, sans-serif', fontSize: '28px', color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // 3. Nút Bỏ qua / Tiếp theo
    const skipBtn = this.add.text(1150, 620, 'Suivant ⏭', {
      fontFamily: 'Arial, sans-serif', fontSize: '28px', color: '#1d3557', backgroundColor: '#f4d35e', padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: skipBtn, alpha: 0.6, duration: 500, yoyo: true, repeat: -1 });

    const goToMap = () => {
      introVideo.stop();
      this.scene.start('MapScene');
    };

    skipBtn.on('pointerdown', goToMap);
    introVideo.on('complete', goToMap); // Hết video tự chuyển
  }
}