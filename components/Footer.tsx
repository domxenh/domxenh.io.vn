export default function Footer() {
  const hotlineDisplay = "0352.595.444"
  const hotlineTel = "0352595444"

  const zaloLink = `https://zalo.me/${hotlineTel}`
  const messengerLink = "https://m.me/301095173088222"

  const btnClass =
    "group inline-flex items-center gap-3 rounded-full border border-[#FFD66B]/25 bg-black/25 px-4 py-2.5 shadow-[0_12px_34px_rgba(0,0,0,0.4)] transition hover:brightness-110 hover:border-[#FFD66B]/55 active:scale-[0.98]"

  const iconWrapClass =
    "grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-[#FFD66B] transition group-hover:bg-white/10"

  const labelTopClass =
    "block text-[12.5px] sm:text-[13px] font-extrabold tracking-[0.12em] text-[#FFD66B] drop-shadow-[0_0_16px_rgba(255,214,107,0.75)]"

  // ✅ FIX: tách 2 hàng chữ ra (mt-1) + bỏ -mt
  const labelBottomClass =
    "block mt-1 text-[13px] sm:text-[14px] font-semibold text-white/85"

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#071014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${hotlineTel}`} className={btnClass} aria-label="Gọi Hotline">
              <span className={iconWrapClass}>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M7.5 3.5c.6-1 1.9-1.3 2.9-.7l1.4.9c1 .6 1.3 1.9.7 2.9l-1 1.7c-.2.4-.2.9 0 1.3a13.7 13.7 0 0 0 5.4 5.4c.4.2.9.2 1.3 0l1.7-1c1-.6 2.3-.3 2.9.7l.9 1.4c.6 1 .3 2.3-.7 2.9l-1.2.7c-1.5.9-3.3 1.1-4.9.5-6.2-2.2-11.2-7.2-13.4-13.4-.6-1.6-.4-3.4.5-4.9l.7-1.2Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="leading-none">
                <span className={labelTopClass}>HOTLINE</span>
                <span className={labelBottomClass}>{hotlineDisplay}</span>
              </span>
            </a>

            <a
              href={zaloLink}
              target="_blank"
              rel="noreferrer"
              className={btnClass}
              aria-label="Nhắn Zalo"
            >
              <span className={iconWrapClass}>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M5 6.8C5 5.25 6.25 4 7.8 4h8.4C17.75 4 19 5.25 19 6.8v6.6c0 1.55-1.25 2.8-2.8 2.8H11l-3.8 2.7c-.5.35-1.2-.02-1.2-.63V16.2c-.63-.5-1-.97-1-2.8V6.8Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9h6l-6 6h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="leading-none">
                <span className={labelTopClass}>ZALO</span>
                <span className={labelBottomClass}>Nhắn ngay</span>
              </span>
            </a>

            <a
              href={messengerLink}
              target="_blank"
              rel="noreferrer"
              className={btnClass}
              aria-label="Nhắn Messenger"
            >
              <span className={iconWrapClass}>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M12 4C7.6 4 4 7.3 4 11.4c0 2.3 1.1 4.4 2.9 5.8v2.6c0 .7.8 1.1 1.4.7l2.4-1.4c.6.1 1.3.2 1.9.2 4.4 0 8-3.3 8-7.4S16.4 4 12 4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M8.2 13.7 11 10.8l2 2 2.8-2.1-2.8 3-2-2-2.8 2Z" fill="currentColor" />
                </svg>
              </span>
              <span className="leading-none">
                <span className={labelTopClass}>MESSENGER</span>
                <span className={labelBottomClass}>Nhắn ngay</span>
              </span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}