"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function ProductCard({ product }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/san-pham/${product.slug}`}>
        <div className="product-card text-center">

          <img
            src={product.image}
            alt={product.name}
            className="mx-auto h-60 object-contain"
          />

          <h3 className="mt-6 text-xl heading">
            {product.name}
          </h3>

          <p className="mt-4 price">
            {product.price.toLocaleString()} đ
          </p>

          <div className="mt-6">
            <button className="btn-brand">
              Mua ngay
            </button>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}