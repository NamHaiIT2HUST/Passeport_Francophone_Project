# ==========================================
# FILE: game/scripts/core_systems.rpy
# CHỨC NĂNG: Khởi tạo hệ thống Class Python bên trong Ren'Py
# ==========================================

init python:
    class PasseportFrancophone:
        def __init__(self, player_name, style="Diplomate"):
            self.player_name = player_name
            self.player_style = style
            
            # Khởi tạo Thanh đo Thuyết phục (Jauge de Persuasion) ở mức 50%
            self.persuasion_gauge = 50
            
            # Khởi tạo Độ uy tín (Crédibilité)
            self.credibility = 100
            
            # Túi đồ: Lưu trữ Thẻ bằng chứng (Cartes Preuves) và Dấu mộc (Tampons)
            self.inventory = []
            
        def process_choice(self, logique, langue, empathie, equilibre):
            """Hàm xử lý khi người chơi chọn một lập luận trong Bàn tròn"""
            # Thuật toán tính tổng điểm tác động
            impact = (logique + langue + empathie + equilibre) * 3
            
            # Hệ thống tính cách Mii: Cộng điểm thưởng (Bonus)
            if self.player_style == "Diplomate":
                impact += 2  # Ngoại giao luôn được lợi về mặt thuyết phục
                
            # Cập nhật thanh đo
            self.persuasion_gauge += impact
            
            # Đảm bảo thanh đo không vượt quá giới hạn 0-100
            self.persuasion_gauge = max(0, min(100, self.persuasion_gauge))
            
            return self.persuasion_gauge
            
        def add_evidence(self, item_name):
            """Hàm thu thập Thẻ bằng chứng khi khám phá bản đồ"""
            if item_name not in self.inventory:
                self.inventory.append(item_name)
                
        def add_tampon(self, country_name):
            """Hàm đóng Dấu mộc Hộ chiếu khi thắng màn chơi"""
            if country_name not in self.inventory:
                self.inventory.append(country_name)