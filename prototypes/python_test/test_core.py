class PasseportFrancophoneDemo:
    def __init__(self, player_name, style="Diplomate"):
        self.player_name = player_name
        self.player_style = style
        self.persuasion_gauge = 50  # Thanh Thuyết phục bắt đầu ở mức 50%
        
    def show_ui(self):
        print("\n" + "="*50)
        print(f"SỨ GIẢ: {self.player_name} | PHONG CÁCH: {self.player_style}")
        print(f"THANH ĐO THUYẾT PHỤC: {'█' * (self.persuasion_gauge // 5)}{'-' * (20 - self.persuasion_gauge // 5)} {self.persuasion_gauge}%")
        print("="*50)

    def process_dialogue(self, choice_id, data):
        if choice_id not in data:
            print("Lựa chọn không hợp lệ!")
            return
            
        choice = data[choice_id]
        print(f"\n🗣️ BẠN NÓI: \"{choice['text']}\"")
        
        # Lấy 4 chỉ số từ kịch bản
        logique = choice["logique"]
        langue = choice["langue"]
        empathie = choice["empathie"]
        equilibre = choice["equilibre"]
        
        # Thuật toán mô phỏng: Tính tổng tác động lên Thanh Thuyết phục
        impact = (logique + langue + empathie + equilibre) * 3
        self.persuasion_gauge += impact
        
        # Giữ thanh đo trong khoảng 0 - 100
        self.persuasion_gauge = max(0, min(100, self.persuasion_gauge))
        
        print(f"📊 Đánh giá: Logique({logique}) | Langue({langue}) | Empathie({empathie}) | Équilibre({equilibre})")
        print(f"📈 Tác động tới đàm phán: {'+' if impact > 0 else ''}{impact}%")
        
        self.check_win_condition()

    def check_win_condition(self):
        if self.persuasion_gauge >= 100:
            print("\n🎉 THÀNH CÔNG! Đạt được sự đồng thuận. Mở khóa Dấu mộc Québec!")
        elif self.persuasion_gauge <= 0:
            print("\n❌ THẤT BẠI! Các bên đã rời khỏi bàn đàm phán. Xung đột leo thang.")

# Dữ liệu kịch bản giả lập cho Level 2 (Québec)
quebec_dialogues = {
    "1": {
        "text": "Vous avez tort. La forêt est plus importante que l'économie.",
        "logique": 1, "langue": 0, "empathie": -2, "equilibre": -2
    },
    "2": {
        "text": "L'usine doit être interdite immédiatement.",
        "logique": 0, "langue": -1, "empathie": -1, "equilibre": -3
    },
    "3": {
        "text": "Nous pouvons autoriser le projet dans une zone limitée, avec une énergie verte.",
        "logique": 3, "langue": 2, "empathie": 2, "equilibre": 3
    }
}

if __name__ == "__main__":
    game = PasseportFrancophoneDemo(player_name="Alex", style="Diplomate")
    
    print("\n🌲 [BỐI CẢNH QUÉBEC]: Công ty khai thác gỗ muốn xây nhà máy trên vùng đất linh thiêng của người bản địa.")
    game.show_ui()
    
    print("\nChọn một phương án lập luận để giải quyết xung đột:")
    for key, val in quebec_dialogues.items():
        print(f"[{key}] {val['text']}")
        
    # Giả lập người chơi nhập lựa chọn từ bàn phím
    while 0 < game.persuasion_gauge < 100:
        user_input = input("\nNhập số (1, 2, 3) để chọn lập luận: ")
        game.process_dialogue(user_input, quebec_dialogues)
        game.show_ui()
        if game.persuasion_gauge >= 100 or game.persuasion_gauge <= 0:
            break