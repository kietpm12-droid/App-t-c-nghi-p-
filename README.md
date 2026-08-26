# Phone Public Lookup

Website nhập 1 số điện thoại -> tìm các thông tin công khai đã được công cụ tìm kiếm lập chỉ mục.

## Cách hoạt động

Frontend gọi `POST /api/lookup`.
Backend gọi Brave Search API với 4 truy vấn:
- `"SĐT"`
- `site:facebook.com "SĐT"`
- `site:zalo.me "SĐT"`
- `"SĐT" -site:facebook.com -site:zalo.me`

Kết quả chỉ là các trang công khai mà công cụ tìm kiếm biết tới. Không có chức năng truy cập cơ sở dữ liệu riêng tư của Facebook/Zalo.

## Chạy local

Cần Node.js 18+.

```bash
npm install
```

Tạo `.env` từ `.env.example` và điền:

```text
BRAVE_API_KEY=...
PORT=3000
```

Sau đó chạy:

```bash
node server.js
```

Mở `http://localhost:3000`.

## Đưa lên GitHub

GitHub chỉ lưu mã nguồn. Bạn cần deploy backend lên một nền tảng chạy Node.js (Render, Railway, Fly.io, VPS...) và đặt biến môi trường `BRAVE_API_KEY` trên nền tảng đó.

Không đặt API key trực tiếp trong `public/index.html` hoặc commit file `.env`.

## Lưu ý

- Có thể không tìm thấy Facebook/Zalo dù số đó có tài khoản, vì công cụ tìm kiếm không nhất thiết lập chỉ mục tài khoản đó.
- Không sử dụng để lấy dữ liệu riêng tư, vượt cài đặt quyền riêng tư, hoặc truy cập cơ sở dữ liệu nội bộ.
