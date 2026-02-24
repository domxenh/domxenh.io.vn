Đọc trạng thái project theo README_DEV.md


# 📦 PROJECT v1.0: DOMXENH.IO.VN – ĐÓM XÊNH

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
- Phải có đánh dấu ở đầu CODE dạng Code () , code ()... Và có kết thúc ở cuối CODE dạng End Code (), End code()... Để tôi còn biết đường sửa hoặc nhờ bạn sửa dựa trên Code cũ
- Phải có đường dẫn rõ ràng khi kêu tôi chỉnh sửa file nào đó nếu không tôi rất khó tìm.

===End Ver1.0===


# 📦 PROJECT v1.1: DOMXENH.IO.VN – ĐÓM XÊNH
1️⃣ MỤC TIÊU UI BAN ĐẦU

Anh yêu cầu:

UI kiểu iOS

Scroll animation như iPhone page

Parallax

Fade khi cuộn

Text scale khi scroll

Blur header khi scroll

Sticky buy button

Hero nhỏ lại (1/5 màn hình)

Bo tròn header & menu kiểu Apple

Product detail giống Apple Store

Dark luxury theme

2️⃣ CONCEPT GIAO DIỆN CHÍNH ĐÃ CHỐT
🎨 Dark Luxury Palette

Background: #0B1417
Section alt: #0F1F23
Card: #13262B
Brand: #0F5C63
Accent light: #FFD66B
Heading: #FFFFFF
Sub text: #A8C0C4
Muted text: #6E8B8D

✨ Hiệu ứng

Card glow vàng khi hover

Drop-shadow glow cho ảnh sản phẩm

Hover transform -6px

Button gradient brand

Badge vàng đậm

3️⃣ FILE ĐANG ẢNH HƯỞNG GIAO DIỆN
app/page.tsx
components/Hero.tsx
components/ProductCard.tsx
globals.css
components/Header.tsx
next.config.ts
4️⃣ CÁC LỖI ĐÃ GẶP & CÁCH FIX
❌ 1. next not recognized

Nguyên nhân:
Chưa npm install

Fix:

npm install
❌ 2. Prisma build fail trên Vercel

Lỗi:

PrismaClientInitializationError

Nguyên nhân:

Thiếu DATABASE_URL

Sai connection mode

Thiếu prisma generate khi build

Fix:

package.json phải có:
"build": "prisma generate && next build",
"postinstall": "prisma generate"
❌ 3. DATABASE_URL không hợp lệ

Lỗi:

the URL must start with postgresql://

Fix:
Phải dùng:

postgresql://...

Không được:

http://
❌ 4. Can't reach database server

Nguyên nhân:
Dùng sai connection mode trên Supabase

Fix:
Chọn:

Direct connection

KHÔNG dùng:

Transaction pooler

Session pooler

❌ 5. ERR_TOO_MANY_REDIRECTS

Nguyên nhân:
Loop redirect giữa:

domxenh.io.vn
www.domxenh.io.vn
vercel.app

Fix cuối cùng:

Set www.domxenh.io.vn
 làm Primary trên Vercel

Không cấu hình redirect trong next.config.ts nữa

Không dùng project-level redirect (vì Hobby plan không cho)

5️⃣ GIT WORKFLOW ĐÃ CHUẨN HÓA

Trường hợp push bị reject:

git pull origin main --rebase
git push origin main

Quy trình chuẩn mỗi lần chỉnh UI:

npm run dev
git add .
git commit -m "update homepage"
git pull origin main --rebase
git push origin main

Vercel auto deploy.

6️⃣ YÊU CẦU LÀM VIỆC CỦA BẠN (RẤT QUAN TRỌNG)

Bạn yêu cầu:

1️⃣ Trong code phải có:

Đoạn tóm tắt bằng tiếng Việt ở đầu code

Comment trong code để bạn biết chỉnh ở đâu

Cuối code phải có:

end code
2️⃣ Khi chỉnh sửa:

Phải gửi file hoàn chỉnh

Không gửi thiếu đoạn

Không gửi nửa chừng

3️⃣ UI phải:

Sang

Cao cấp

Có chiều sâu

Không bệt màu

Glow ánh đèn đúng vibe ngoài trời

7️⃣ KIẾN TRÚC HỆ THỐNG HIỆN TẠI

Frontend:

Next.js 16 App Router

Animation:

Framer Motion

Database:

Supabase PostgreSQL

ORM:

Prisma 5.22

Deploy:

Vercel

Plan:

Hobby

8️⃣ CÁC NGUYÊN TẮC KHÔNG ĐƯỢC QUÊN
⚠ Prisma + Vercel bắt buộc:

DATABASE_URL trên Vercel

prisma generate trước build

Direct connection

⚠ Domain:

Chỉ có 1 Primary

Không tự ý thêm redirect lung tung

Không dùng next.config redirect nếu đã set trên domain

9️⃣ TÌNH TRẠNG HIỆN TẠI

✔ Database kết nối được
✔ Deploy thành công
✔ Domain hoạt động
✔ Dark theme đã áp dụng
✔ Card glow hoạt động
✔ Build pipeline ổn

🔟 NHỮNG VIỆC CHƯA LÀM HOÀN CHỈNH (CHO PHIÊN SAU)

Parallax hero chuẩn iPhone

Text scale khi scroll

Blur header khi scroll

Sticky buy button (product detail)

Product detail layout giống Apple Store thật 100%

Tối ưu animation mượt hơn

Giảm chiều cao hero chính xác 20vh

Tinh chỉnh spacing theo chuẩn Apple grid

1️⃣1️⃣ ĐỊNH HƯỚNG LẦN SAU

Lần sau khi mở chat mới, bạn có thể nói:

Tiếp tục dự án domxenh.io.vn. Dựa trên PROJECT_CONTEXT.md

Hoặc:

Tiếp tục phần parallax iPhone hero

🎯 TỔNG KẾT

Phiên này chúng ta đã:

Fix toàn bộ lỗi hệ thống (build, prisma, domain)

Chuẩn hóa workflow

Chốt palette và style system

Ổn định production

Tạo nền tảng vững chắc để tập trung vào UI cao cấp

Hiện tại dự án đã sang giai đoạn:

👉 Tối ưu trải nghiệm & nâng cấp giao diện
===End ver1.1===

=====Ver 1.2=====update Header + Hero=====
🔹 HEADER VER 1 – Glass Basic
🎨 Giao diện

backdrop-blur-xl

bg-white/5

border border-white/15

rounded-full

Shadow cơ bản

📌 Menu

Hover chuyển trắng

Không active state

Không animation

❌ Chưa có

Logo image

Glow

Underline

Scroll effect

👉 Đây là bản glass tĩnh ban đầu.

🔹 HEADER VER 2 – Premium Glow
🟡 Logo

Thêm logo image (40px)

Border trắng mờ

Glow vàng quanh logo

Hover tăng sáng logo

📌 Menu

Hover chuyển vàng #FFD66B

Active có ánh sáng chân chữ

Drop-shadow vàng khi hover

❌ Chưa có

Underline trượt

Scroll blur dynamic

👉 Bản này bắt đầu có luxury vibe.

🔹 HEADER VER 3 – Animated Interaction
✨ Thêm

layoutId underline trượt giữa tab

useScroll detect scroll

Blur tăng khi scroll

Background opacity thay đổi theo scroll

🛠 Sau đó

Fix lỗi .to is not a function

Dùng useMotionTemplate

👉 Đây là bản có interaction cao cấp.

🔹 HEADER VER 4 – Cinematic Apple Pro
🟡 Logo

Tăng size lên 48px (+2 cấp)

Border trắng mờ

Glow vàng mạnh

Pulse animation vòng ngoài

Hover tăng glow

📌 Menu

Underline trượt mượt

Hover vàng luxury

Drop-shadow vàng

🌫 Scroll

Blur tăng theo % scroll

Background opacity tăng theo scroll

Shadow sâu outdoor

👉 Đây là bản ổn định cao cấp hiện tại.

              🔹 HEADER VER 5

1️⃣ Logo:

Bo tròn mềm hơn (hiện tại đang hơi cứng)

Viền mịn hơn (bớt thô)

Giảm khoảng trắng trong logo

Logo nhìn to hơn nhưng không phá layout

2️⃣ Text “ĐÓM XÊNH”

Thêm ánh sáng mềm

Nổi hơn trên nền tối

3️⃣ Menu text

To hơn

Đậm hơn

Sáng hơn

Hover vẫn giữ vàng luxury

Không bỏ underline animation

================================🎬 HERO – LỊCH SỬ VERSION===================
              🔹 HERO VER 1 – Cinematic Basic
📏 Layout

90vh

Background full PNG

Overlay gradient

✨ Animation

Fade in title

Slide up text

Glow chữ “Xênh.”

Button glow

Drop shadow depth

👉 Đây là bản giống ảnh mẫu anh yêu cầu.

              🔹 HERO VER 2 – Shrink Scroll
➕ Thêm

useScroll

Height 90vh → 60vh

Scale background

Giảm opacity nhẹ

❌ Vẫn giữ animation cũ

👉 Bản chuyển từ static sang interactive.

              🔹 HERO VER 3 – Apple Behavior
➕ Thêm

Thu đúng 20vh

Parallax background tách layer

Text scale riêng

Border radius khi co

❌ Nhưng mất:

Fade animation ban đầu

Glow mạnh

Button depth

👉 Bản thiên về kỹ thuật, mất vibe.

              🔹 HERO VER 4 – Cinematic Apple Pro

Khôi phục lại toàn bộ:

🎨 Cinematic

Fade + slide animation

Glow chữ vàng mạnh

Button glow xanh

Drop shadow depth

📏 Apple Behavior

90vh → 20vh

Border radius xuất hiện khi co

Parallax background

Text scale riêng

Opacity giảm dần khi scroll

👉 Đây là bản cân bằng giữa cinematic và Apple interaction.

              