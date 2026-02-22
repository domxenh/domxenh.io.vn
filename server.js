const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép load toàn bộ file trong public
app.use(express.static(path.join(__dirname, "public")));

// Route trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "trang-chu", "index.html"));
});

// Route sản phẩm
app.get("/san-pham", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "san-pham", "index.html"));
});

// Route liên hệ
app.get("/lien-he", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "lien-he", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});