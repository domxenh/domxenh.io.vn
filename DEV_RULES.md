# 🧠 DEVELOPMENT RULES - domxenh.io.vn

---

# 1️⃣ Nguyên tắc chung

- Code phải rõ ràng, dễ đọc.
- Không viết tắt khó hiểu.
- Không viết logic phức tạp trong 1 dòng.
- Mỗi chức năng phải tách riêng thành module.
- Không commit code lỗi.

---

# 2️⃣ Cấu trúc thư mục chuẩn

project/
│
├── server.js
├── package.json
├── PROJECT_PROGRESS.md
├── DEV_RULES.md
│
├── routes/
├── controllers/
├── models/
├── middleware/
│
└── public/
    ├── assets/
    ├── trang-chu/
    ├── san-pham/
    └── lien-he/

---

# 3️⃣ Quy tắc đặt tên

## Biến
- camelCase
Ví dụ:

userName
orderTotal
productPrice


## File
- viết thường
- dùng dấu gạch ngang nếu cần

Ví dụ:

order-controller.js
admin-middleware.js


## Route
- dùng dấu gạch ngang

/san-pham
/admin/login
/order/create


---

# 4️⃣ Quy tắc server

## PORT phải luôn viết như sau:


const PORT = process.env.PORT || 3000;


## Static folder


app.use(express.static("public"));


---

# 5️⃣ Quy tắc Git

## Trước khi commit:

- Kiểm tra chạy local OK
- Không commit file rác
- Không commit node_modules

## Message commit phải rõ nghĩa

❌ Sai:

update
fix
abc


✅ Đúng:

fix routing homepage
add order API
remove old index file


---

# 6️⃣ Bảo mật

- Không commit file chứa mật khẩu
- Dùng file .env cho:
  - JWT_SECRET
  - DATABASE_URL
  - API keys

## File .env KHÔNG được push GitHub

Trong .gitignore phải có:


node_modules
.env


---

# 7️⃣ Khi thêm tính năng mới

Phải theo quy trình:

1. Tạo route
2. Tạo controller
3. Tạo model (nếu có DB)
4. Test local
5. Commit rõ ràng
6. Push

---

# 8️⃣ Cấu trúc API chuẩn

Ví dụ tạo đơn hàng:

POST /api/orders

Response thành công:


{
"success": true,
"message": "Order created successfully"
}


Response lỗi:


{
"success": false,
"message": "Missing required fields"
}


---

# 9️⃣ Logging

Khi debug phải dùng:


console.log("DEBUG:", data);


Không để console.log dư thừa khi deploy production.

---

# 🔟 Nguyên tắc nâng cấp

Khi dự án lớn hơn:

- Tách server thành:
  - app.js
  - config/
  - services/
- Dùng MVC chuẩn

---

# 🚀 Mục tiêu cuối cùng

- Code sạch
- Dễ mở rộng
- Dễ bảo trì
- Bảo mật tốt
- Deploy ổn định

---