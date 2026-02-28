import fs from "fs"
import path from "path"
import sharp from "sharp"

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, "public")

const INPUT_RE = /\.(png|jpe?g)$/i
const SKIP_RE = /\.(webp|avif)$/i

const WEBP_QUALITY = 80

// ✅ CHỈ xóa png mặc định (an toàn hơn)
// Nếu bạn muốn xóa luôn jpg/jpeg, đổi thành true
const DELETE_JPG_TOO = true

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

async function convertAndMaybeDelete(file) {
  const ext = path.extname(file).toLowerCase()
  const outWebp = `${withoutExt(file)}.webp`

  // Skip if webp already exists
  if (await fileExists(outWebp)) return

  // Convert
  await sharp(file, { failOn: "none" })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outWebp)

  // Verify output exists
  const ok = await fileExists(outWebp)
  if (!ok) return

  // Delete source (png always, jpg optional)
  if (ext === ".png") {
    await safeUnlink(file)
  } else if ((ext === ".jpg" || ext === ".jpeg") && DELETE_JPG_TOO) {
    await safeUnlink(file)
  }
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log("No directory:", PUBLIC_DIR)
    process.exit(0)
  }

  const all = walk(PUBLIC_DIR)

  const targets = all.filter((f) => {
    const st = fs.statSync(f)
    if (!st.isFile()) return false
    if (SKIP_RE.test(f)) return false
    return INPUT_RE.test(f)
  })

  let converted = 0
  let deleted = 0

  for (const f of targets) {
    const beforeExt = path.extname(f).toLowerCase()
    const rel = path.relative(ROOT, f)
    try {
      const outWebp = `${withoutExt(f)}.webp`
      const existedBefore = await fileExists(outWebp)

      await convertAndMaybeDelete(f)

      const existedAfter = await fileExists(outWebp)
      if (!existedBefore && existedAfter) converted++

      // count delete by checking original exists
      const stillExists = await fileExists(f)
      if (!stillExists && beforeExt === ".png") deleted++

      console.log("✔", rel)
    } catch (e) {
      console.log("✖", rel)
      console.error(e?.message || e)
    }
  }

  console.log(`Done. Converted=${converted}, PNG deleted=${deleted}`)
}

main()