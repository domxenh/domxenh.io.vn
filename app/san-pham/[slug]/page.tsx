// Import dữ liệu sản phẩm giả
import { products } from "@/lib/data";

// Import notFound của Next.js
import { notFound } from "next/navigation";

// 👇 Khai báo type cho params
type ProductDetailProps = {
  params: {
    slug: string;
  };
};

// Trang chi tiết sản phẩm
export default function ProductDetail({ params }: ProductDetailProps) {
  // Tìm sản phẩm theo slug
  const product = products.find(
    (p) => p.slug === params.slug
  );

  // Nếu không có sản phẩm → trả về 404
  if (!product) return notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {product.name}
      </h1>

      <p>{product.description}</p>
    </div>
  );
}

// END CODE 1