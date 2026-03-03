import fs from "fs"
import path from "path"
import sharp from "sharp"

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, "public")

const INPUT_RE = /\.(png|jpe?g)$/i
const SKIP_RE = /\.(webp|avif)$/i

const WEBP_QUALITY = 80

// ✅ an toàn: chỉ xóa PNG mặc định.
// Nếu bạn muốn xóa luôn jpg/jpeg, giữ true.
// Khuyến nghị: false để tránh mất file gốc.
const DELETE_JPG_TOO = true

// Giới hạn xử lý song song (nhẹ CPU/RAM)
const CONCURRENCY = 2

function withoutExt(file) {
  return file.replace(/\.[^.]+$/, "")
}

async function fileExists(p) {
  try {
    await fs.promises.access(p, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function safeUnlink(p) {
  try {
    await fs.promises.unlink(p)
  } catch {
    // ignore
  }
}

async function statSafe(p) {
  try {
    return await fs.promises.stat(p)
  } catch {
    return null
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) files.push(...walk(p))
    else files.push(p)
  }
  return files
}

function normalizeToAbs(maybePath) {
  if (!maybePath) return null
  // chokidar-cli {path} thường trả đường dẫn relative
  const abs = path.isAbsolute(maybePath) ? maybePath : path.join(ROOT, maybePath)
  return abs
}

function isEligibleInput(fileAbs) {
  if (!fileAbs) return false
  if (SKIP_RE.test(fileAbs)) return false
  return INPUT_RE.test(fileAbs)
}

async function shouldConvert(srcAbs, outWebpAbs) {
  const srcSt = await statSafe(srcAbs)
  if (!srcSt || !srcSt.isFile()) return false

  const outSt = await statSafe(outWebpAbs)
  if (!outSt) return true // chưa có webp

  // Nếu webp mới hơn hoặc bằng src => không cần convert lại
  return outSt.mtimeMs < srcSt.mtimeMs
}

async function convertAndMaybeDelete(srcAbs) {
  const ext = path.extname(srcAbs).toLowerCase()
  const outWebpAbs = `${withoutExt(srcAbs)}.webp`

  if (!(await shouldConvert(srcAbs, outWebpAbs))) return { converted: false, deleted: false, out: outWebpAbs }

  await sharp(srcAbs, { failOn: "none" })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outWebpAbs)

  const ok = await fileExists(outWebpAbs)
  if (!ok) return { converted: false, deleted: false, out: outWebpAbs }

  let deleted = false
  if (ext === ".png") {
    await safeUnlink(srcAbs)
    deleted = !(await fileExists(srcAbs))
  } else if ((ext === ".jpg" || ext === ".jpeg") && DELETE_JPG_TOO) {
    await safeUnlink(srcAbs)
    deleted = !(await fileExists(srcAbs))
  }

  return { converted: true, deleted, out: outWebpAbs }
}

async function runQueue(items, worker, concurrency) {
  let idx = 0
  let active = 0
  const results = []

  return await new Promise((resolve) => {
    const next = () => {
      if (idx >= items.length && active === 0) return resolve(results)

      while (active < concurrency && idx < items.length) {
        const item = items[idx++]
        active++
        Promise.resolve()
          .then(() => worker(item))
          .then((r) => results.push(r))
          .catch((e) => results.push({ error: e, item }))
          .finally(() => {
            active--
            next()
          })
      }
    }
    next()
  })
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log("No directory:", PUBLIC_DIR)
    process.exit(0)
  }

  // ✅ Nếu có tham số file từ watcher -> chỉ xử lý file đó
  const argPath = process.argv[2]
  const oneAbs = normalizeToAbs(argPath)

  let targets = []
  if (oneAbs) {
    if (isEligibleInput(oneAbs) && (await fileExists(oneAbs))) {
      targets = [oneAbs]
    } else {
      // file đổi tên / bị xóa / không đúng định dạng => bỏ qua nhẹ nhàng
      process.exit(0)
    }
  } else {
    // ✅ Không có tham số => quét full (dùng cho prebuild/convert:webp)
    const all = walk(PUBLIC_DIR)
    targets = all.filter((f) => {
      const st = fs.statSync(f)
      if (!st.isFile()) return false
      if (SKIP_RE.test(f)) return false
      return INPUT_RE.test(f)
    })
  }

  let converted = 0
  let deleted = 0

  const results = await runQueue(
    targets,
    async (srcAbs) => {
      const rel = path.relative(ROOT, srcAbs)
      try {
        const r = await convertAndMaybeDelete(srcAbs)
        if (r.converted) converted++
        if (r.deleted) deleted++
        console.log("✔", rel)
        return r
      } catch (e) {
        console.log("✖", rel)
        console.error(e?.message || e)
        return { error: e }
      }
    },
    CONCURRENCY
  )

  // Khi chạy 1 file từ watcher: đừng spam log “Done”
  if (!oneAbs) {
    console.log(`Done. Converted=${converted}, Deleted=${deleted}, Targets=${results.length}`)
  }
}

main()