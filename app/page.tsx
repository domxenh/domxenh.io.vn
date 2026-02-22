export default function HomePage() {
  return (
    <main className="container">
      <h1>DomXenh.io</h1>
      <p>Nền tảng kết nối nguồn hàng & thương mại điện tử</p>

      <section style={{ marginTop: "40px" }}>
        <h2 className="section-title">Sản phẩm nổi bật</h2>

        <div className="product-grid">
          <div className="product-card">
            <h3>Áo thun local brand</h3>
            <p>Giá sỉ tốt nhất</p>
          </div>

          <div className="product-card">
            <h3>Phụ kiện thời trang</h3>
            <p>Nhập trực tiếp từ xưởng</p>
          </div>

          <div className="product-card">
            <h3>Giày sneaker</h3>
            <p>Giá sỉ toàn quốc</p>
          </div>

          <div className="product-card">
            <h3>Túi xách thời trang</h3>
            <p>Nguồn hàng Quảng Châu</p>
          </div>
        </div>
      </section>
    </main>
  );
}