const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");

// Cho phép đọc dữ liệu JSON từ form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép dùng file tĩnh (HTML, CSS)
app.use(express.static("public"));

// Route test
app.get("/", (req, res) => {
    res.send("Server đang chạy 🚀");
});

app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
app.post("/order", async (req, res) => {
    const { name, product } = req.body;

    try {
        await axios.post("https://script.google.com/macros/s/AKfycbwB-PTMyXpgJQezZtRd-0DJojnP6O6Vkq_YYLFRj45Nix41Jz464OzlHTPZLm3iSQgH/exec", {
            name: name,
            product: product
        });

        res.send("Đặt hàng thành công và đã lưu vào Google Sheets!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi gửi dữ liệu lên Google");
    }
});