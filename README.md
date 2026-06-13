# 🌍 Passeport Francophone (Mission Médiation)

Dự án Game Giáo dục tham gia **Hackathon Jeu parle français 2026**. Trò chơi mô phỏng quá trình đàm phán, hòa giải xung đột môi trường và pháp lý bằng tiếng Pháp (ODD 15 & ODD 16), được phát triển trên nền tảng **Phaser 3**.

## 🎮 Giới thiệu Game

Người chơi sẽ vào vai một thực tập sinh Liên Hợp Quốc, được giao nhiệm vụ điều tra và giải quyết các khủng hoảng môi trường và xã hội tại các quốc gia Francophonie. Game kết hợp học tiếng Pháp thông qua tương tác với NPC, thu thập bằng chứng và tổ chức hòa giải.

### Tính năng chính:
- 🗺️ **Bản đồ tương tác**: Chọn điểm đến tại các quốc gia Francophonie
- 💬 **Hội thoại với NPC**: Học từ vựng tiếng Pháp qua tình huống thực tế
- 📋 **Thu thập bằng chứng**: Xây dựng hồ sơ cho các cuộc hòa giải
- ⚖️ **Mô phỏng hòa giải**: Áp dụng ODD 15 (Bảo vệ rừng) và ODD 16 (Hòa bình & Công lý)
- 🎒 **Hệ thống inventory**: Quản lý bằng chứng thu thập được
- 📖 **Từ điển tích hợp**: Tra cứu từ vựng tiếng Pháp

## 💻 Dành cho Developer

### Công nghệ sử dụng
- **Phaser 3** - Game Engine
- **JavaScript (ES6+)** - Ngôn ngữ lập trình
- **npm** - Quản lý package

### Yêu cầu cài đặt
- Node.js 18+ 
- npm hoặc yarn
- Git

### Hướng dẫn Setup môi trường Dev

**Bước 1: Clone dự án**
```bash
git clone <địa_chỉ_repo_github_của_team>
cd Passeport_Francophone_Project
```

**Bước 2: Cài đặt dependencies**
```bash
npm install
```

**Bước 3: Chạy development server**
```bash
npm run dev
```

Game sẽ chạy tại `http://localhost:3000` (hoặc port được hiển thị trong terminal).

### Cấu trúc dự án
```
Passeport_Francophone_Project/
├── src/
│   ├── scenes/           # Các scene của game
│   │   ├── PreloaderScene.js    # Loading screen
│   │   ├── MainMenuScene.js     # Menu chính
│   │   ├── IntroScene.js        # Cảnh mở đầu (văn phòng UN)
│   │   ├── MapScene.js          # Bản đồ thế giới
│   │   ├── GameScene.js         # Scene gameplay chính
│   │   └── QuebecScene.js       # Scene Quebec (nếu có)
│   └── main.js           # Entry point
├── public/
│   ├── assets/           # Hình ảnh, audio
│   └── twine_data/       # Dữ liệu từ Twine (nếu có)
├── twine_data/
│   └── dialogue.json     # Dữ liệu hội thoại
├── index.html            # HTML chính
└── package.json          # Cấu hình project
```

### Assets cần có
- `bg_office.png` - Background văn phòng
- `bg_map.png` - Background bản đồ thế giới
- `bg_quebec.jpg` - Background Quebec
- `bg_add.png` - Background phụ
- `bg_gameplay.jpg` - Background menu chính
- `npc_manager.png` - NPC quản lý
- `npc_quebec_resident.jpg` - NPC cư dân Quebec
- `logo_un.png` - Logo Liên Hợp Quốc
- `target_ring.png` - Vòng target
- Audio files: `intro_voice.mp3`, `ambient_wind.mp3`, `footstep.mp3`, `click_ui.mp3`, `quebec_hint_voice.mp3`

## 👥 Đóng góp

1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án mã nguồn mở phục vụ mục đích giáo dục.

---

**Developed with ❤️ for Hackathon Jeu parle français 2026**