// app/san-pham/[slug]/page.tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ProductCard from "@/components/ProductCard"
import ProductDetailClient from "@/components/product/ProductDetailClient"
import ProductPricingClient from "@/components/product/ProductPricingClient"
import SkuSelector, { type EdisonSku } from "@/components/product/SkuSelector"
import StickyBuyBarClient from "../../../components/product/StickyBuyBarClient"
import { getProductBySlug, getRelatedProductsByCategory } from "@/lib/products"

export const revalidate = 120

type ParamsLike = { slug: string } | Promise<{ slug: string }>

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://domxenh.io.vn").replace(/\/$/, "")
}

function stablePercent20to30(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return 20 + (Math.abs(h) % 11)
}
function calcOldPrice(price: number, key: string) {
  const pct = stablePercent20to30(key)
  return Math.round(price * (1 + pct / 100))
}

export async function generateMetadata({ params }: { params: ParamsLike }): Promise<Metadata> {
  const p = await Promise.resolve(params)
  const product = await getProductBySlug(p.slug)

  const base = siteUrl()

  if (!product) {
    return {
      title: "Sản phẩm | ĐÓM XÊNH",
      description: "Không tìm thấy sản phẩm.",
      alternates: { canonical: `${base}/san-pham-full` },
      robots: { index: false, follow: false },
    }
  }

  const url = `${base}/san-pham/${product.slug}`
  const description =
    (product.description || "").replace(/\s+/g, " ").trim().slice(0, 160) ||
    `Chi tiết sản phẩm ${product.name} của ĐÓM XÊNH.`

  const ogImage = product.image?.startsWith("http")
    ? product.image
    : `${base}${product.image?.startsWith("/") ? "" : "/"}${product.image}`

  return {
    title: `${product.name} | ĐÓM XÊNH`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.name} | ĐÓM XÊNH`,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ĐÓM XÊNH`,
      description,
      images: [ogImage],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: ParamsLike }) {
  const p = await Promise.resolve(params)
  const product = await getProductBySlug(p.slug)
  if (!product) return notFound()

  const related = await getRelatedProductsByCategory({
    categoryId: product.category.id,
    excludeSlug: product.slug,
    take: 8,
  })

  const inStock = product.stock > 0

  // ✅ Nhận diện 3 sản phẩm Edison
  const isEdison = product.slug === "bo-day-den-edison"
  const isEdison1Toc = product.slug === "bo-day-den-edison-1-toc"
  const isEdison2Toc = product.slug === "bo-day-den-edison-2-toc"
  const isEdisonFamily = isEdison || isEdison1Toc || isEdison2Toc

  // Base ảnh SKU (sửa nếu bạn đặt folder khác)
  const base = "/images/edison/"

  // Thumbs cho nút “Xem ảnh sản phẩm”
  // Nếu 2-tóc có thumbs riêng: đổi folder thumb ở đây.
  const thumbFolder = isEdison ? "edison" : isEdison1Toc ? "1toc" : isEdison2Toc ? "2toc" : "edison"
  const edisonThumbBase = `/images/edison/thumb/2toc/`
  const edisonThumbs = [
    `${edisonThumbBase}1.webp`,
    `${edisonThumbBase}2.webp`,
    `${edisonThumbBase}3.webp`,
    `${edisonThumbBase}4.webp`,
    `${edisonThumbBase}5.webp`,
    `${edisonThumbBase}6.webp`,
    `${edisonThumbBase}7.webp`,
    `${edisonThumbBase}8.webp`,
  ]

  const edisonDefaultImage = edisonThumbs[0]
  const edisonExtraImages = edisonThumbs.slice(1)

  // ✅ SKU Edison (cũ)
  const edisonSkus: EdisonSku[] = isEdison
    ? [
        { label: "Edison COMBO 20m30", skuCode: "edison 10m15+10m15", image: `${base}edison-10m15+10m15.webp`, price: 404000, oldPrice: calcOldPrice(404000, "edison 10m15+10m15") },
        { label: "Edison COMBO 15m30", skuCode: "edison 10m20+5m10", image: `${base}edison-10m20+5m10.webp`, price: 389000, oldPrice: calcOldPrice(389000, "edison 10m20+5m10") },
        { label: "10 Mét Dây + 15 Bóng", skuCode: "edison 10m15", image: `${base}edison-10m15.webp`, price: 230000, oldPrice: calcOldPrice(230000, "edison 10m15") },
        { label: "5 Mét Dây + 10 Bóng", skuCode: "edison 5m10", image: `${base}edison-5m10.webp`, price: 180000, oldPrice: calcOldPrice(180000, "edison 5m10") },
        { label: "10 Mét Dây + 20 Bóng", skuCode: "edison 10m20", image: `${base}edison-10m20.webp`, price: 272000, oldPrice: calcOldPrice(272000, "edison 10m20") },
        { label: "7,5 Mét Dây + 12 Bóng", skuCode: "edison 7,5m12", image: `${base}edison-7,5m12.webp`, price: 199000, oldPrice: calcOldPrice(199000, "edison 7,5m12") },
        { label: "15 Mét Dây + 10 Bóng", skuCode: "edison 15m10", image: `${base}edison-15m10.webp`, price: 213000, oldPrice: calcOldPrice(213000, "edison 15m10") },
        { label: "15 Mét Dây + 15 Bóng", skuCode: "edison 15m15", image: `${base}edison-15m15.webp`, price: 276000, oldPrice: calcOldPrice(276000, "edison 15m15") },
        { label: "15 Mét Dây + 24 Bóng", skuCode: "edison 15m24", image: `${base}edison-15m24.webp`, price: 322000, oldPrice: calcOldPrice(322000, "edison 15m24") },
      ]
    : []

  // ✅ SKU Edison 1-tóc
  const edison1TocSkus: EdisonSku[] = isEdison1Toc
    ? [
        { label: "1 tóc 10 Mét Dây + 15 Bóng", skuCode: "1toc 10m15", image: `${base}1toc-10m15.webp`, price: 236000, oldPrice: calcOldPrice(236000, "1toc 10m15") },
        { label: "1 tóc 5 Mét + 10 Bóng", skuCode: "1toc 5m10", image: `${base}1toc-5m10.webp`, price: 184000, oldPrice: calcOldPrice(184000, "1toc 5m10") },
        { label: "1 tóc 10 Mét + 20 Bóng", skuCode: "1toc 10m20", image: `${base}1toc-10m20.webp`, price: 282000, oldPrice: calcOldPrice(282000, "1toc 10m20") },
        { label: "1 tóc COMBO 15 Mét + 30 bóng", skuCode: "1toc 10m20+ 5m10", image: `${base}1toc-10m20+5m10.webp`, price: 404000, oldPrice: calcOldPrice(404000, "1toc 10m20+ 5m10") },
        { label: "1 tóc 7,5 Mét + 12 Bóng", skuCode: "1toc 7,5m12", image: `${base}1toc-7,5m12.webp`, price: 205000, oldPrice: calcOldPrice(205000, "1toc 7,5m12") },
        { label: "1 tóc 15 Mét Dây + 10 Bóng", skuCode: "1toc 15m10", image: `${base}1toc-15m10.webp`, price: 217000, oldPrice: calcOldPrice(217000, "1toc 15m10") },
        { label: "1 tóc 15 Mét Dây + 15 Bóng", skuCode: "1toc 15m15", image: `${base}1toc-15m15.webp`, price: 283000, oldPrice: calcOldPrice(283000, "1toc 15m15") },
        { label: "1 tóc 15 Mét Dây + 24 Bóng", skuCode: "1toc 15m24", image: `${base}1toc-15m24.webp`, price: 290000, oldPrice: calcOldPrice(290000, "1toc 15m24") },
      ]
    : []

  // ✅ SKU Edison 2-tóc (mới)
  const edison2TocSkus: EdisonSku[] = isEdison2Toc
    ? [
        {
          label: "2 tóc COMBO 15 Mét + 30 bóng",
          skuCode: "2toc 10m20+ 5m10",
          image: `${base}2toc-10m20+5m10.webp`,
          price: 565000,
          oldPrice: calcOldPrice(565000, "2toc 10m20+ 5m10"),
        },
        {
          label: "2 tóc COMBO 20 Mét + 30 bóng",
          skuCode: "2toc 10m15+ 10m15",
          image: `${base}2toc-10m15+10m15.webp`,
          price: 580000,
          oldPrice: calcOldPrice(580000, "2toc 10m15+ 10m15"),
        },
        {
          label: "2 tóc 10 Mét Dây + 15 Bóng",
          skuCode: "2toc 10m15",
          image: `${base}2toc-10m15.webp`,
          price: 313000,
          oldPrice: calcOldPrice(313000, "2toc 10m15"),
        },
        {
          label: "2 tóc 5 Mét Dây + 10 Bóng",
          skuCode: "2toc 5m10",
          image: `${base}2toc-5m10.webp`,
          price: 227000,
          oldPrice: calcOldPrice(227000, "2toc 5m10"),
        },
        {
          label: "2 tóc 10 Mét Dây + 20 Bóng",
          skuCode: "2toc 10m20",
          image: `${base}2toc-10m20.webp`,
          price: 389000,
          oldPrice: calcOldPrice(389000, "2toc 10m20"),
        },
        {
          label: "2 tóc 7,5 Mét Dây + 12 Bóng",
          skuCode: "2toc 7,5m12",
          image: `${base}2toc-7,5m12.webp`,
          price: 257000,
          oldPrice: calcOldPrice(257000, "2toc 7,5m12"),
        },
        {
          label: "2 tóc 15 Mét Dây + 10 Bóng",
          skuCode: "2toc 15m10",
          image: `${base}2toc-15m10.webp`,
          price: 262000,
          oldPrice: calcOldPrice(262000, "2toc 15m10"),
        },
        {
          label: "2 tóc 15 Mét Dây + 15 Bóng",
          skuCode: "2toc 15m15",
          image: `${base}2toc-15m15.webp`,
          price: 364000,
          oldPrice: calcOldPrice(364000, "2toc 15m15"),
        },
        {
          label: "2 tóc 15 Mét Dây + 24 Bóng",
          skuCode: "2toc 15m24",
          image: `${base}2toc-15m24.webp`,
          price: 462000,
          oldPrice: calcOldPrice(462000, "2toc 15m24"),
        },
      ]
    : []

  // ✅ Dùng list đúng theo slug
  const activeSkus: EdisonSku[] = isEdison
    ? edisonSkus
    : isEdison1Toc
      ? edison1TocSkus
      : isEdison2Toc
        ? edison2TocSkus
        : []

  const defaultSku =
    isEdisonFamily && activeSkus.length
      ? activeSkus.reduce((min, s) => (s.price < min.price ? s : min), activeSkus[0])
      : null

  const initialPrice = defaultSku ? defaultSku.price : product.price
  const initialOldPrice = defaultSku ? defaultSku.oldPrice : product.oldPrice
  const initialSkuLabel = defaultSku ? defaultSku.label : product.name
  const initialSkuCode = defaultSku?.skuCode ?? product.slug
  const initialImage = defaultSku?.image || product.image

  const defaultImageForGallery = isEdisonFamily ? edisonThumbs[0] : product.image
  const extraImages = isEdisonFamily ? edisonExtraImages : []

  const absImage = product.image?.startsWith("http")
    ? product.image
    : `${siteUrl()}${product.image?.startsWith("/") ? "" : "/"}${product.image}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [absImage],
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: "ĐÓM XÊNH" },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: initialPrice,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl()}/san-pham/${product.slug}`,
    },
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-8 lg:pb-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="hidden lg:flex mb-6 text-sm text-white/70 flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-white">
          Trang chủ
        </Link>
        <span className="text-white/35">/</span>
        <Link href="/san-pham-full#products" className="hover:text-white">
          Sản phẩm
        </Link>
        <span className="text-white/35">/</span>
        <span className="text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.35)]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <ProductDetailClient
          slug={product.slug}
          name={product.name}
          defaultImage={defaultImageForGallery}
          extraImages={extraImages}
          mobileCompact
        />

        {isEdisonFamily ? (
          <div className="lg:hidden -mt-1">
            <SkuSelector
              slug={product.slug}
              defaultImage={defaultImageForGallery}
              skus={activeSkus}
              compact
              maxHeightVh={34}
              title="Chọn độ dài dây"
              resetText="Xem ảnh sản phẩm"
            />
          </div>
        ) : null}

        <div className="hidden lg:block lg:col-span-5">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 md:backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.65)] p-6 md:p-7">
            <div className="text-white/60 text-sm">
              Danh mục:{" "}
              <span className="text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                {product.category.name}
              </span>
            </div>

            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-[#FFD66B] drop-shadow-[0_0_30px_rgba(255,214,107,0.85)]">
              {product.name}
            </h1>

            <ProductPricingClient
              name={product.name}
              inStock={inStock}
              initialPrice={initialPrice}
              initialOldPrice={initialOldPrice}
            />

            <div className="mt-4 text-white/70">
              Tình trạng:{" "}
              {inStock ? (
                <span className="text-white/90 font-semibold">Còn hàng ({product.stock})</span>
              ) : (
                <span className="text-white/50 font-semibold">Hết hàng</span>
              )}
            </div>

            {isEdisonFamily ? (
              <div className="mt-3">
                <SkuSelector slug={product.slug} defaultImage={defaultImageForGallery} skus={activeSkus} />
              </div>
            ) : null}

            <div className="mt-6 h-px bg-white/10" />

            <div className="mt-6">
              <div className="text-white font-semibold text-lg">Mô tả</div>
              <p className="mt-3 text-white/75 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="hidden lg:block mt-14">
          <div className="text-white text-2xl font-semibold">Gợi ý cùng danh mục</div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((pp) => (
              <ProductCard key={pp.id} product={pp} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}

      <StickyBuyBarClient
        productSlug={product.slug}
        productName={product.name}
        initialSkuLabel={initialSkuLabel}
        initialSkuCode={initialSkuCode}
        initialImage={initialImage}
        initialPrice={initialPrice}
        initialOldPrice={initialOldPrice}
        inStock={inStock}
      />
    </main>
  )
}