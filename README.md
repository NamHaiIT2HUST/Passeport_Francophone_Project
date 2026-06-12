# 🌍 Passeport Francophone (Mission Médiation)

Dự án Game Giáo dục tham gia **Hackathon Jeu parle français 2026**. Trò chơi mô phỏng quá trình đàm phán, hòa giải xung đột môi trường và pháp lý bằng tiếng Pháp (ODD 15 & ODD 16), được phát triển trên nền tảng Ren'Py.

## 👥 Dành cho Team Nội dung (Biên kịch, Giáo viên tiếng Pháp)

Team nội dung **không cần** biết code. Toàn bộ kịch bản, từ vựng, thông tin thẻ bằng chứng sẽ được nhập trực tiếp trên Google Sheets.

1. Truy cập vào link Google Sheets của dự án (Liên hệ Trưởng nhóm để nhận quyền Edit).
2. Nhập dữ liệu theo đúng định dạng các cột (Tham khảo Tab hướng dẫn trong Sheets).
3. Thông báo cho Team Dev sau khi kịch bản hoàn tất để cập nhật vào game.

## 💻 Dành cho Team Developer

Dự án được chia làm 2 phần: **Ren'Py Game Engine** (chạy logic game) và **Python Tools** (xử lý dữ liệu tự động).

### Yêu cầu cài đặt
* [Ren'Py SDK](https://www.renpy.org/latest.html) (Phiên bản 8.5.3 trở lên)
* Python 3.10+
* Git
* VS Code (Khuyên dùng cài thêm extension `Ren'Py Language`)

### Hướng dẫn Setup môi trường Dev

**Bước 1: Clone dự án**
```bash
git clone <địa_chỉ_repo_github_của_team>
cd PasseportFrancophone