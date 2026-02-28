#        //Chạy http://localhost:3000/ + xóa cache
Remove-Item -Recurse -Force .next
npm run dev
#        //Seed lại:
npx prisma db seed
#       //cover ảnh
node scripts/convert-images.mjs
#       //Kiểm tra nhanh sản phẩm trong Prisma Studio:
npx prisma studio

# 1) Build (khuyến nghị bắt buộc trước khi push)
npm run build
## Nếu bạn chỉ muốn chắc “cache không làm bậy” (thỉnh thoảng mới cần):
npm run clean
npm run build

# 2) Chạy lint (dự án bạn chưa có script lint)
npx next lint

# 3) Prisma (chỉ khi bạn có sửa schema)
npx prisma generate

# 4) Kiểm tra Git trước khi commit
git status
git diff

# 5) Commit/push
git add -p
git commit -m "fix: ..."
git push
