import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        <Link href="/">Trang chủ</Link>
        <Link href="/san-pham">Sản phẩm</Link>
        <Link href="/nguon-hang-si">Nguồn hàng sỉ</Link>
        <Link href="/gui-san-pham">Gửi sản phẩm</Link>
        <Link href="/tu-van-tmdt">Tư vấn TMĐT</Link>
        <Link href="/cong-dong">Cộng đồng</Link>
      </div>
    </header>
  );
}