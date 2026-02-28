// app/san-pham-full/loading.tsx
export default function LoadingSanPhamFull() {
  return (
    <main className="min-h-screen pt-28 md:pt-32">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 animate-pulse"
          >
            <div className="h-8 w-72 bg-white/10 rounded-xl" />
            <div className="mt-3 h-4 w-[60%] bg-white/10 rounded-lg" />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="h-40 bg-white/10 rounded-2xl" />
                  <div className="mt-4 h-4 bg-white/10 rounded-lg" />
                  <div className="mt-3 h-4 w-2/3 bg-white/10 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

// end code