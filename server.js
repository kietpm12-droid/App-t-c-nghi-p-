const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Kiểm tra server
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend đang hoạt động!"
  });
});

// API tra cứu
app.get("/api/search", (req, res) => {
  const phone = String(req.query.phone || "").trim();

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập số điện thoại"
    });
  }

  // Dữ liệu mẫu để kiểm tra hệ thống
  const customers = {
    "0900000000": {
      name: "Khách hàng mẫu",
      phone: "0900000000",
      note: "Dữ liệu kiểm tra hệ thống"
    },
    "0911111111": {
      name: "Nguyễn Văn A",
      phone: "0911111111",
      note: "Dữ liệu mẫu"
    }
  };

  const customer = customers[phone];

  if (!customer) {
    return res.json({
      success: true,
      found: false,
      message: "Không tìm thấy thông tin"
    });
  }

  res.json({
    success: true,
    found: true,
    data: customer
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
