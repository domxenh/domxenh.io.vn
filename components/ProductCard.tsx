// Code 3

import Link from "next/link";
import { Product } from "@/lib/types";

// Khai báo type cho props truyền vào component
type ProductCardProps = {
  product: Product;
};

// Component hiển thị một sản phẩm
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold mb-2">
        {product.name}
      </h3>

      <Link
        href={`/san-pham/${product.slug}`}
        className="text-blue-600"
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

// End code 3