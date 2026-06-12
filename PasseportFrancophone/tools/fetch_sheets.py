import json
import os

# Script khung: Xử lý dữ liệu và xuất ra thư mục game/data/
def generate_mock_data():
    print("Đang mô phỏng kết nối Google Sheets...")
    
    # Dữ liệu từ vựng giả lập (Tab 1)
    vocab_data = {
        "reboisement": {"def": "Action de planter des arbres.", "ipa": "/ʁə.bwa.zəmɑ̃/"},
        "médiation": {"def": "Entremise destinée à concilier.", "ipa": "/me.dja.sjɔ̃/"}
    }
    
    # Đường dẫn lưu file ngược ra thư mục game/data/ của Ren'Py
    save_path = os.path.join(os.path.dirname(__file__), '..', 'game', 'data', 'vocabulary.json')
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    with open(save_path, 'w', encoding='utf-8') as f:
        json.dump(vocab_data, f, ensure_ascii=False, indent=4)
        
    print(f"Thành công! Đã xuất file ra: {save_path}")

if __name__ == "__main__":
    generate_mock_data()