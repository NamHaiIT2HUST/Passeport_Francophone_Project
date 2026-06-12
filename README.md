# Technical Blueprint: Passeport Francophone

*Du an Serious Game danh cho Hackathon Jeu Parle Francais 2026*

## 1. Tong quan ky thuat

- **Game Engine:** Ren'Py, su dung Python lam nen tang logic.
- **Kien truc:** Data-Driven Architecture, tach logic game khoi du lieu noi dung.
- **Cong cu bo tro:**
  - **Twine:** Prototyping kich ban va so do hoi thoai.
  - **Google Sheets:** Cong cu cong tac du lieu giua Dev, Writer va Mentor.
  - **GitHub:** Quan ly version code.
  - **WebAssembly / HTML5:** Nen tang xuat ban demo.

## 2. Cau truc du lieu

Tat ca du lieu can duoc trinh bay duoi dang bang trong Google Sheets truoc khi Dev xuat ra file `.csv` hoac `.json`.

### Tab 1: Vocabulary

**Muc dich:** Ho tro nguoi hoc B1+ tra tu truc tiep qua popup/tooltip.

| Cot | Mo ta |
| --- | --- |
| `ID_Tu` | Ma dinh danh duy nhat cua tu vung |
| `Tu_Tieng_Phap` | Tu hoac cum tu tieng Phap |
| `Dinh_nghia_Tieng_Phap` | Dinh nghia bang tieng Phap |
| `Vi_du` | Cau vi du theo ngu canh game |

### Tab 2: Evidence

**Muc dich:** Vat pham thu thap de phuc vu lap luan trong Inventory System.

| Cot | Mo ta |
| --- | --- |
| `ID_The` | Ma dinh danh duy nhat cua the bang chung |
| `Ten_The_Tieng_Phap` | Ten the hien thi trong game |
| `Mo_ta` | Mo ta noi dung va y nghia bang chung |
| `Level_so_huu` | Level ma nguoi choi co the thu thap the |

### Tab 3: Dialogues

**Muc dich:** Hoi thoai tuyen tinh trong giai doan kham pha.

| Cot | Mo ta |
| --- | --- |
| `ID_Thoai` | Ma dinh danh dong hoi thoai |
| `Ten_NPC` | Ten nhan vat dang noi |
| `Cau_thoai_Tieng_Phap` | Noi dung cau thoai bang tieng Phap |
| `Hanh_dong_he_thong` | Lenh he thong tuy chon, vi du them the, mo canh, tang diem |

### Tab 4: RoundTable

**Muc dich:** Co che cot loi cua ban tron tranh bien, dua tren so khop logic giua lap luan va bang chung.

| Cot | Mo ta |
| --- | --- |
| `ID_Luot_Dau` | Ma dinh danh luot tranh bien |
| `NPC_Phat_bieu` | Phat bieu cua NPC trong luot hien tai |
| `Phe_Phan_Dien_Noi` | Lap luan phan dien hoac phan bac |
| `ID_The_Bang_Chung_DUNG` | ID the bang chung dung can duoc chon |
| `Phan_hoi_Dung` | Phan hoi khi nguoi choi chon dung bang chung |
| `Phan_hoi_Sai` | Phan hoi khi nguoi choi chon sai bang chung |
| `Diem_Thay_Doi` | So diem persuasion_score thay doi |

### Tab 5: UIText

**Muc dich:** Dich toan bo UI sang tieng Phap.

| Cot | Mo ta |
| --- | --- |
| `ID_Giao_dien` | Ma dinh danh chuoi UI |
| `Y_nghia_Tieng_Viet` | Ghi chu noi bo ve y nghia chuoi |
| `Chu_hien_thi_Tieng_Phap` | Chu hien thi trong game |

## 3. Lo trinh thuc hien

### Giai doan 1: Chuan bi noi dung truoc 10/6

1. **Writer:** Hoan thien 4 tab du lieu tren Google Sheets cho Level 1: Madagascar.
2. **Mentor:** Review tinh su pham va do chuan xac cua tieng Phap o muc B1+.
3. **Dev:** Hoan thien core engine, dac biet class `NegotiationEngine` trong Ren'Py.

### Giai doan 2: Hien thuc hoa tu 10/6 den 13/6

1. **Ngay 1:** Do du lieu tu Sheets vao game. Xay dung UI Inventory va Tooltip.
2. **Ngay 2:** Gan logic tranh bien vao engine. Test luong thang/thua.
3. **Ngay 3:** Danh bong trai nghiem bang am thanh, hinh anh va nhac nen.
4. **Ngay 4:** Export Web, test tren trinh duyet va quay video demo 1.5 phut.

## 4. Prompt mau cho AI

### Prompt 1: Khoi tao Class Dam phan

```markdown
Hay tao class Python `NegotiationEngine` cho Ren'Py:

1. Quan ly `persuasion_score` tu 0 den 100 va `inventory` dang list.
2. Tao ham `check_argument(evidence_id, correct_id)` de so khop logic tranh bien.
3. Tra ve ket qua Boolean va cap nhat diem so dua tren hanh dong.
```

## 5. Core Engine de xuat

```python
class NegotiationEngine:
    def __init__(self, persuasion_score=50, inventory=None):
        self.persuasion_score = self._clamp_score(persuasion_score)
        self.inventory = inventory or []

    def _clamp_score(self, value):
        return max(0, min(100, int(value)))

    def add_evidence(self, evidence_id):
        if evidence_id not in self.inventory:
            self.inventory.append(evidence_id)

    def has_evidence(self, evidence_id):
        return evidence_id in self.inventory

    def check_argument(self, evidence_id, correct_id, score_delta=10):
        is_correct = evidence_id == correct_id and self.has_evidence(evidence_id)

        if is_correct:
            self.persuasion_score = self._clamp_score(self.persuasion_score + score_delta)
        else:
            self.persuasion_score = self._clamp_score(self.persuasion_score - score_delta)

        return is_correct
```

## 6. Nguyen tac ky thuat

- Noi dung game phai nam trong data files, han che hard-code dialogue va UI text trong script Ren'Py.
- Moi dong du lieu can co ID on dinh de tranh loi khi sap xep lai Google Sheets.
- Logic tranh bien chi nen phu thuoc vao ID bang chung, khong phu thuoc vao text hien thi.
- Tat ca UI text hien thi cho nguoi choi nen duoc lay tu tab `UIText`.
- Ban demo web can duoc test tren trinh duyet truoc khi nop hackathon.
