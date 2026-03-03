// /app/san-pham/[slug]/loading.tsx
export default function LoadingProductDetail() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="rounded-[32px] border border-white/10 bg-white/5 overflow-hidden">
            <div className="aspect-[4/3] bg-white/10" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-7">
            <div className="h-4 w-40 bg-white/10 rounded-lg" />
            <div className="mt-4 h-10 w-[85%] bg-white/10 rounded-xl" />
            <div className="mt-6 h-7 w-52 bg-white/10 rounded-xl" />
            <div className="mt-6 h-px bg-white/10" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-24 bg-white/10 rounded-lg" />
              <div className="h-4 w-full bg-white/10 rounded-lg" />
              <div className="h-4 w-[92%] bg-white/10 rounded-lg" />
              <div className="h-4 w-[80%] bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// end code