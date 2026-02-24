Đọc trạng thái project theo README_DEV.md


# 📦 PROJECT: DOMXENH.IO.VN – ĐÓM XÊNH

## 1️⃣ Công nghệ sử dụng

- Next.js 16 (App Router)
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Vercel (Deploy production)

---

## 2️⃣ Trạng thái hiện tại

✅ Đã kết nối Supabase thành công  
✅ Đã cấu hình Prisma  
✅ Đã tạo schema: Category + Product  
✅ Đã chạy `prisma db push` thành công  
✅ Đã seed dữ liệu (`prisma db seed`)  
✅ Trang chủ đang query dữ liệu từ database  
✅ Localhost chạy ổn tại: http://localhost:3000  

---

## 3️⃣ Database Schema

### Category
- id (uuid)
- name
- slug (unique)
- createdAt

### Product
- id (uuid)
- name
- slug (unique)
- price (Int)
- description
- image
- stock
- categoryId (relation)
- createdAt

---

## 4️⃣ Lệnh quan trọng

Chạy dev:
npm run dev
Push schema:

npx prisma db push


Seed dữ liệu:

npx prisma db seed


Reset cache Next:

Remove-Item -Recurse -Force .next


---

## 5️⃣ Cấu trúc thư mục chính

/app
/components
/lib
/prisma
  ├── schema.prisma
  └── seed.ts
.env

---

## 6️⃣ Hướng phát triển tiếp theo (TODO)

- [ ] Trang chi tiết sản phẩm
- [ ] Trang danh mục
- [ ] Admin thêm/sửa/xóa sản phẩm
- [ ] Upload ảnh sản phẩm
- [ ] Tối ưu SEO production
- [ ] Deploy production ổn định

---

## 7️⃣ Ghi chú quan trọng

- Supabase đang dùng free tier (có cold start).
- Prisma version ~5.x
- Nếu lag dev → xoá `.next` rồi chạy lại.
- Không bật `log: ['query']` trong production.
- Phải có đánh dấu ở đầu CODE dạng Code 1, code 2... Và có kết thúc ở cuối CODE dạng End Code 1, End code 2... Để tôi còn biết đường sửa hoặc nhờ bạn sửa dựa trên Code cũ
- Phải có đường dẫn rõ ràng khi kêu tôi chỉnh sửa file nào đó nếu không tôi rất khó tìm.

