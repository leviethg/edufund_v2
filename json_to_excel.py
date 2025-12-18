import json
import pandas as pd

# 1️⃣ Đọc file JSON
with open("response.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 2️⃣ Lấy danh sách kết quả
results = data["data"]["content"]

# 3️⃣ Chuẩn hóa dữ liệu
rows = []
for r in results:
    rows.append({
        "Học kỳ": r.get("semester"),
        "Mã môn": r.get("subjectCode"),
        "Tên môn": r.get("subjectName"),
        "Số tín chỉ": r.get("credit"),
        "Điểm hệ 10": r.get("point10"),
        "Điểm chữ": r.get("pointChar"),
        "Điểm hệ 4": r.get("point4"),
    })

# 4️⃣ Xuất Excel
df = pd.DataFrame(rows)
df.to_excel("ket_qua_hoc_tap.xlsx", index=False)

print("✅ Đã xuất file ket_qua_hoc_tap.xlsx")
