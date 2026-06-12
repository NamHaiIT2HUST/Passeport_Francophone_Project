# ==========================================
# FILE: game/scripts/level_2_quebec.rpy
# CHỨC NĂNG: Kịch bản đàm phán Level 2
# ==========================================

# Khai báo nhân vật NPC cho màn Québec
define rep_entreprise = Character("Đại diện Công ty")
define chef_autochtone = Character("Tộc trưởng Bản địa")
define sys = Character("Hệ thống")

label start:
    # 1. Khởi tạo người chơi và hệ thống cốt lõi
    $ game_core = PasseportFrancophone(player_name="Sứ giả", style="Diplomate")
    
    scene bg room # Phông nền mặc định của Ren'Py
    
    sys "🌍 BẠN ĐÃ ĐẾN QUÉBEC!"
    sys "Nhiệm vụ: Giải quyết tranh chấp đất đai giữa công ty lâm sản và bộ tộc bản địa."
    
    rep_entreprise "Nous avons besoin de construire l'usine pour créer des emplois."
    chef_autochtone "C'est une terre sacrée ! Vous détruisez notre héritage !"
    
    sys "Thanh đo Thuyết phục hiện tại: [game_core.persuasion_gauge]%"
    
    # 2. Vòng lặp đàm phán (Table Ronde)
    menu:
        "Bạn sẽ đáp lại thế nào để xoa dịu cả hai bên?"
        
        "A. (Chỉ trích) Vous avez tort. La forêt est plus importante que l'économie.":
            # Gọi hàm xử lý lựa chọn (Logique: 1, Langue: 0, Empathie: -2, Equilibre: -2)
            $ current_score = game_core.process_choice(1, 0, -2, -2)
            sys "❌ Bạn đã tỏ ra quá áp đặt và thiếu thấu cảm."
            
        "B. (Dung hòa) Nous pouvons autoriser le projet dans une zone limitée, avec une énergie verte...":
            # Gọi hàm xử lý lựa chọn tối ưu (Logique: 3, Langue: 2, Empathie: 2, Equilibre: 3)
            $ current_score = game_core.process_choice(3, 2, 2, 3)
            sys "✅ Lập luận xuất sắc! Bạn đã đề xuất một thỏa hiệp hợp lý."
            
    # 3. Kiểm tra kết quả
    sys "Thanh đo Thuyết phục cập nhật: [game_core.persuasion_gauge]%"
    
    if game_core.persuasion_gauge >= 60:
        $ game_core.add_tampon("Québec")
        sys "🎉 THÀNH CÔNG! Thỏa thuận được thông qua. Bạn nhận được dấu mộc Québec!"
    else:
        sys "⚠️ THẤT BẠI! Cuộc đàm phán đổ vỡ. Hãy thử lại."
        
    return