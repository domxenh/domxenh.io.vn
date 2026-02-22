const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Route trang chủ
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/trang-chu/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});