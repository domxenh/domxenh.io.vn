import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      <section className="my-10">
        <h1 className="text-3xl font-bold mb-6">
          Đèn LED Sân Vườn
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}