# Product DTOs

## CreateProductDto

สำหรับสร้าง Product ใหม่

### Example Request Body:
```json
{
  "title": "React E-commerce Template",
  "description": "Full-featured e-commerce template built with React and TypeScript",
  "installation_doc": "1. Clone repository\n2. Run npm install\n3. Configure environment\n4. Run npm start",
  "blurb": "Modern, responsive e-commerce solution",
  "preview_url": "https://demo.example.com",
  "price": 49.99,
  "features": [
    "Responsive Design",
    "TypeScript Support", 
    "Payment Integration",
    "Admin Dashboard"
  ],
  "category_id": 1,
  "seller_id": 1,
  "file_path": "/uploads/react-ecommerce.zip",
  "hero_image": "/images/react-hero.jpg"
}
```

## UpdateProductDto

สำหรับอัพเดท Product (ทุก field เป็น optional)

### Example Request Body:
```json
{
  "title": "Updated Product Title",
  "price": 59.99,
  "features": ["New Feature", "Updated Feature"]
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | ชื่อสินค้า |
| description | string | ❌ | คำอธิบายสินค้า |
| installation_doc | string | ❌ | คู่มือการติดตั้ง |
| blurb | string | ❌ | คำอธิบายสั้นๆ |
| preview_url | string | ❌ | URL สำหรับ preview |
| price | number | ✅ | ราคา (2 ทศนิยม) |
| features | string[] | ❌ | รายการ features |
| category_id | number | ✅ | ID ของหมวดหมู่ |
| seller_id | number | ✅ | ID ของผู้ขาย |
| file_path | string | ❌ | path ของไฟล์สินค้า |
| hero_image | string | ❌ | path ของรูป hero |