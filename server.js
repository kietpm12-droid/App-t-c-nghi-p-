const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let customers = [];

// Kiểm tra server
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hệ thống quản lý khách hàng đang hoạt động"
  });
});

// Lấy danh sách khách hàng
app.get("/api/customers", (req, res) => {
  res.json({
    success: true,
    data: customers
  });
});

// Thêm khách hàng
app.post("/api/customers", (req, res) => {
  const {
    name,
    address,
    phone,
    note,
    latitude,
    longitude
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Họ tên và số điện thoại là bắt buộc"
    });
  }

  const customer = {
    id: Date.now(),
    name,
    address: address || "",
    phone,
    note: note || "",
    latitude: latitude || null,
    longitude: longitude || null,
    createdAt: new Date().toISOString()
  };

  customers.push(customer);

  res.json({
    success: true,
    message: "Đã thêm khách hàng",
    data: customer
  });
});

// Xóa khách hàng
app.delete("/api/customers/:id", (req, res) => {
  const id = Number(req.params.id);

  customers = customers.filter(customer => customer.id !== id);

  res.json({
    success: true,
    message: "Đã xóa khách hàng"
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
