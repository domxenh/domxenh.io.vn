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

📦 PROJECT v1.2: DOMXENH.IO.VN – ĐÓM XÊNH
1️⃣ STACK CÔNG NGHỆ

Frontend:

Next.js 16 (App Router)

TypeScript

Framer Motion (Animation)

TailwindCSS

Backend:

Supabase PostgreSQL

Prisma ORM 5.22

Deploy:

Vercel (Hobby Plan)

2️⃣ TRẠNG THÁI HỆ THỐNG (HIỆN TẠI)

✔ Supabase kết nối thành công
✔ Prisma hoạt động ổn định
✔ DATABASE_URL đúng format postgresql://
✔ Direct connection mode
✔ prisma generate trước build
✔ Vercel auto deploy từ GitHub
✔ Domain hoạt động ổn định
✔ Dark luxury theme đã áp dụng
✔ Header Cinematic Apple Pro (Ver 4)
✔ Hero Cinematic Apple Pro (Ver 4)

Dự án hiện đang ở giai đoạn:

👉 Tối ưu UI & nâng cấp trải nghiệm cao cấp

3️⃣ DATABASE SCHEMA
Category

id (uuid)

name

slug (unique)

createdAt

Product

id (uuid)

name

slug (unique)

price (Int)

description

image

stock

categoryId (relation)

createdAt

4️⃣ LỆNH QUAN TRỌNG
Dev:

npm run dev

Push schema:

npx prisma db push

Seed:

npx prisma db seed

Generate Prisma:

npx prisma generate

Reset cache Next:

Remove-Item -Recurse -Force .next

Production test local:

npm run build
npm start

5️⃣ GIT WORKFLOW CHUẨN

Mỗi lần update:

npm run dev
git add .
git commit -m "update ui section"
git pull origin main --rebase
git push origin main

Vercel auto deploy.

Nếu push bị reject:

git pull origin main --rebase
git push origin main

6️⃣ CẤU TRÚC THƯ MỤC CHÍNH

/app
/components
/lib
/prisma
├── schema.prisma
└── seed.ts
/public
.env

7️⃣ HEADER – LỊCH SỬ PHÁT TRIỂN
🔹 VER 1 – Glass Basic

Glass blur

Rounded full

Menu hover trắng

Không animation

🔹 VER 2 – Premium Glow

Logo image

Glow vàng quanh logo

Hover vàng #FFD66B

Active có glow chân chữ

🔹 VER 3 – Animated Interaction

layoutId underline trượt

useScroll

Blur dynamic

Background opacity theo scroll

🔹 VER 4 – Cinematic Apple Pro (HIỆN TẠI)

Logo 48px

Glow mạnh

Border 2 đầu sáng

Shimmer viền

Underline trượt mượt

Scroll shrink

Blur tăng theo %

Opacity tăng theo scroll

Dropdown iOS panel style

Icon PNG riêng

Close button Apple style

Click outside để đóng

8️⃣ HERO – LỊCH SỬ PHÁT TRIỂN
🔹 VER 1 – Cinematic Basic

90vh

Fade + Slide

Glow chữ vàng

Button glow

Outdoor vibe

🔹 VER 2 – Shrink Scroll

useScroll

90vh → 60vh

Scale background

🔹 VER 3 – Apple Behavior

Thu đúng 20vh

Parallax layer

Border radius khi co

Text scale riêng

(mất cinematic effect)

🔹 VER 4 – Cinematic Apple Pro (HIỆN TẠI)

90vh → 20vh

Border radius khi co

Parallax background

Text scale riêng

Fade + slide animation

Glow chữ vàng mạnh

Button glow xanh

Opacity giảm khi scroll

Depth shadow outdoor

9️⃣ LỖI ĐÃ TỪNG GẶP & FIX
❌ next not recognized

→ npm install

❌ Prisma build fail

Phải có:

"build": "prisma generate && next build",
"postinstall": "prisma generate"

❌ DATABASE_URL sai format

Phải dùng:

postgresql://

❌ Can't reach database

Phải chọn Direct connection

❌ ERR_TOO_MANY_REDIRECTS

Chỉ set 1 Primary domain trên Vercel
Không dùng next.config redirect

🔟 PRODUCTION RULES (KHÔNG ĐƯỢC QUÊN)

⚠ Vercel phải có:

DATABASE_URL

prisma generate trước build

⚠ Domain:

Chỉ 1 Primary

Không redirect lung tung

⚠ Prisma:

Không bật log query trong production

1️⃣1️⃣ TODO PHIÊN SAU

Trang chi tiết sản phẩm Apple Store style

Sticky buy button

Parallax nâng cao

Tinh chỉnh spacing Apple grid

Animation mượt hơn

SEO production nâng cao

Sitemap + robots

Metadata chuẩn SEO

1️⃣2️⃣ YÊU CẦU CODE STYLE (BẮT BUỘC)

Khi gửi code:

Có phần tóm tắt tiếng Việt đầu file

Có comment chỉ rõ nơi chỉnh sửa

Gửi file hoàn chỉnh

Cuối file có:

end code

🎯 TỔNG KẾT

Dự án đã:

✔ Ổn định backend
✔ Ổn định deploy
✔ Chuẩn hóa workflow
✔ Chốt style system
✔ Hoàn thành Header + Hero phiên bản Cinematic Apple Pro

Hiện tại bước vào giai đoạn:

👉 Tối ưu trải nghiệm cao cấp & hoàn thiện product detail

===End Ver1.2 Stable===

# 📦 PROJECT v1.2: DOMXENH.IO.VN – ĐÓM XÊNH (Next.js + Prisma + Supabase)

> Cập nhật theo tiến trình phiên chat gần nhất:
> - Trang chủ hiển thị **Danh mục sản phẩm dạng “Folder lớn”** (bên trong là ProductCard nhỏ).
> - Tab **Sản phẩm** là trang **full catalog** (tách biệt với trang chủ).
> - Header lên **Ver5** (mượt hơn, mobile panel, backdrop blur đồng bộ Hero, cải thiện logo).
> - Prisma thêm field **isHot** để gắn badge HOT theo DB.
> - Fix lỗi dev Postgres prepared statement (PgBouncer + statement_cache_size).

---

## 1) Công nghệ sử dụng

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Prisma ORM
- Supabase PostgreSQL
- Vercel (deploy)

---

## 2) Trạng thái hiện tại (đã làm)

### ✅ Backend/DB
- Prisma + Supabase PostgreSQL kết nối ổn.
- `Product` có `oldPrice` (giá gạch) và đã thêm `isHot` (HOT badge).
- Seed dữ liệu theo đúng nhóm sản phẩm (Edison / Bóng tròn / Dây & Bóng lẻ).

### ✅ UI/UX
- **Header Ver5**:
  - Scroll shrink mượt (spring smoothing).
  - Border base + shimmer giữ lại.
  - Underline active mượt.
  - Mobile panel (Apple panel style): click khoảng trống đóng, ESC đóng, đóng nhanh hơn, lock scroll khi mở.
  - Backdrop blur phía sau header (không đụng layout), có thể đồng bộ ảnh từ Hero qua CSS var `--hero-bg`.
  - **Logo**: giảm blur/mờ, viền mềm hơn (ring mỏng + inset shadow), glow sắc hơn.

- **Hero**:
  - Dùng ảnh nền `public/images/hero-outdoor.png`.
  - Blur nhẹ để vẫn nhìn thấy ảnh.
  - CTA “Khám phá ngay” có hiệu ứng thu hút (pulse + shimmer).
  - Click CTA scroll xuống section danh mục sản phẩm (`#products`).
  - “Sáng” & “Xênh” nổi bật hơn (màu/weight/glow).
  - Yêu cầu thêm: **không xuống dòng khi màn hình hẹp** → dùng `whitespace-nowrap` + `clamp()` (đã triển khai/đang tinh chỉnh).

- **Trang chủ (Home)**:
  - Hiển thị **3 Folder danh mục lớn**, mỗi folder chứa đúng danh sách sản phẩm nhỏ:
    1) Bộ dây đèn Edison (3 SP)
    2) Bộ dây đèn bóng Tròn (4 SP)
    3) Dây lẻ - Bóng lẻ (2 SP)
  - Mỗi ProductCard hiển thị: giá, giá gạch (oldPrice), badge HOT/SALE, nút “Chi Tiết”.

- **Trang Sản phẩm (full)**:
  - Route: `/san-pham-full`
  - Hiển thị danh sách sản phẩm đầy đủ (catalog grid).
  - Tách biệt khỏi Home (Home chỉ là curated folder).

---

## 3) Cấu trúc route & component (sau khi refactor)

### Routes
- `/` : Trang chủ (Hero + HomeProductFolders)
- `/san-pham-full` : Sản phẩm full catalog
- `/bao-hanh` : Bảo hành
- `/lien-he` : Liên hệ
- `/san-pham/[slug]` : Chi tiết sản phẩm (nếu đang dùng)

### Components quan trọng
- `components/Header.tsx` : Header Ver5
- `components/Hero.tsx` : Hero (CTA + typography + ảnh)
- `components/home/HomeProductFolders.tsx` : 3 folder danh mục lớn (**id="products"**)
- `components/home/folderConfig.ts` : cấu hình tên folder + danh sách tên sản phẩm
- `components/catalog/CatalogGrid.tsx` : grid trang `/san-pham-full`
- `components/ProductCard.tsx` : card dùng chung (home + catalog)
- `components/Fireflies.tsx` : hiệu ứng đom đóm (đồng bộ hero/header nếu bật)

### Lib
- `lib/prisma.ts` : Prisma client singleton
- `lib/products.ts` : query dùng chung (by names / all products)
- `lib/types.ts` : types dùng chung

---

## 4) Database Schema (Prisma)

### Category
- id (uuid)
- name
- slug (unique)
- image? (nếu có)
- createdAt

### Product
- id (uuid)
- name
- slug (unique)
- price (Int)
- oldPrice (Int?)  → giá gạch
- isHot (Boolean @default(false)) → badge HOT theo DB
- description
- image
- stock
- categoryId (relation)
- createdAt

---

## 5) Seed dữ liệu chuẩn theo “Folder trên Home”

### Folder 1: Bộ dây đèn Edison (3)
1. Bộ dây đèn Edison
2. Bộ dây đèn Edison 1 tóc
3. Bộ dây đèn Edison 2 tóc

### Folder 2: Bộ dây đèn bóng Tròn (4)
1. Bộ dây đèn bóng Tròn 3W
2. Bộ dây đèn bóng Tròn 5W
3. Bộ dây đèn bóng Tròn 7W
4. Bộ dây đèn bóng Tròn 9W

### Folder 3: Dây lẻ - Bóng lẻ (2)
1. Dây lẻ
2. Bóng lẻ

> Lưu ý: Home match theo **product.name** đúng như folderConfig. Nếu đổi tên trong DB thì folder sẽ báo “chưa có dữ liệu”.

---

## 6) Lệnh quan trọng

### Dev
```bash
npm run dev
7) Fix lỗi Postgres “prepared statement already exists” (Dev)

Nếu gặp lỗi 42P05: prepared statement "s0" already exists khi dev với Supabase/PgBouncer:

Thêm vào DATABASE_URL:

pgbouncer=true

statement_cache_size=0

Ví dụ:

DATABASE_URL="postgresql://...@...:5432/postgres?pgbouncer=true&statement_cache_size=0"

Sau đó:

Stop dev server (Ctrl+C)

Xoá .next

Run lại npm run dev

8) Quy tắc khi chỉnh code (đúng yêu cầu dự án)

Khi gửi code/patch:

Có tóm tắt tiếng Việt ở đầu file

Có comment chỉ rõ chỗ sửa

Gửi file hoàn chỉnh

Cuối file có dòng // end code

9) Dọn project (khuyến nghị)

Xoá file trùng / không dùng:

components/ParallaxSection.tsx (nếu không import)

lib/data.ts (mock cũ, không dùng nếu đã dùng Prisma)

components/catalog/ProductCard.tsx (nếu trùng với components/ProductCard.tsx)

Header.jpg ở root (đã có public/images/Header.jpg)

SVG template không dùng: public/next.svg, public/vercel.svg, ...

Không commit secrets:

.env, .env.local phải nằm trong .gitignore (không đẩy GitHub)

10) Checklist nhanh khi deploy

Build command: prisma generate && next build

Vercel env vars:

DATABASE_URL (đúng format, có pgbouncer=true&statement_cache_size=0 nếu dùng pooler)

Confirm pages:

/ có Hero + Folder sections

/san-pham-full có catalog grid

Header hoạt động mượt, mobile panel đóng nhanh

===End Ver 1.2===


