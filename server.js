const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép dùng file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "trang-chu", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});