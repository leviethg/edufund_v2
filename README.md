# EduFund - Nền Tảng Học Bổng Blockchain

Dự án nền tảng gây quỹ học bổng minh bạch, kết nối nhà tài trợ và sinh viên thông qua Blockchain.

## 🚀 Hướng dẫn chạy Local (Full Stack)

Để chạy đầy đủ tính năng (Kết nối ví MetaMask thật + Gọi API Backend), bạn cần chạy 3 cửa sổ Terminal song song:

### Bước 1: Chuẩn bị
Tải code về, mở Terminal tại thư mục dự án và chạy:
```bash
npm install
npm install --save-dev hardhat
```

### Bước 2: Chạy Mạng Blockchain (Terminal 1)
Khởi tạo mạng Hardhat Localhost (cung cấp 20 ví test có sẵn tiền ETH):
```bash
npx hardhat node
```
*Giữ cửa sổ này chạy. Nó cung cấp JSON-RPC tại `http://127.0.0.1:8545`.*

### Bước 3: Chạy Backend Server Giả lập (Terminal 2)
Do chưa có Backend thật, chúng ta chạy một server Node.js nhỏ để giả lập API:
```bash
node server.js
```
*Giữ cửa sổ này chạy. Nó cung cấp API tại `http://localhost:3000/v1`.*

### Bước 4: Chạy Frontend (Terminal 3)
```bash
npm run dev
```
Truy cập web tại `http://localhost:5173`.

### Bước 5: Kết nối & Test
1. Vào trang **Cài đặt**.
2. **Tắt "Chế độ Mock"**.
3. Nhấn **Thêm mạng Hardhat** (Nếu chưa thêm vào MetaMask).
4. Nhấn **Kết nối Ví**.
5. Bây giờ bạn có thể **Tạo quỹ** và thấy dữ liệu được lưu vào `server.js` (Lưu ý: Dữ liệu sẽ mất khi tắt server).

## 📂 Cấu trúc thư mục
- `src/`: Mã nguồn Frontend (React).
- `hardhat.config.cjs`: Cấu hình Blockchain Local.
- `server.js`: Server Backend giả lập đơn giản.

## 🎨 Design System
- **Màu chủ đạo:** Blue (`#0f62fe`) & Green (`#00b37e`).
- **Font:** Inter.
- **Style:** Tailwind CSS.