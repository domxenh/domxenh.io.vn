export const metadata = {
  title: "Chính Sách Bảo Hành | DOMXENH",
  description: "Chính sách bảo hành sản phẩm đèn ngoài trời DOMXENH."
}

export default function BaoHanhPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Chính Sách Bảo Hành</h1>

      <div className="mt-6 space-y-4">
        <p>Thời gian bảo hành: 12 tháng.</p>
        <p>Áp dụng với lỗi kỹ thuật từ nhà sản xuất.</p>
        <p>Không áp dụng với lỗi do người dùng gây ra.</p>
      </div>
    </div>
  )
}