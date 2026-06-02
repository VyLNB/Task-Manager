# Task Manager Pro (Full-Stack To-Do App)

Một ứng dụng Quản lý Công việc toàn diện (Full-stack) mang lại trải nghiệm mượt mà, chuyên nghiệp. Ứng dụng không chỉ dừng lại ở các tính năng To-do cơ bản mà còn hỗ trợ **bảng Kanban tương tác**, **phân quyền Workspace (Nhóm)**, và **hỗ trợ Task Cá Nhân**.

Dự án được xây dựng với kiến trúc hiện đại, tập trung vào khả năng mở rộng và UX/UI đẹp mắt.

---

## 🛠 Công nghệ sử dụng

**Frontend (Giao diện người dùng):**
- **React** (với Vite)
- **TypeScript** (Đảm bảo Type-safety)
- **Tailwind CSS** (Giao diện Dark Mode, tối giản, sang trọng)
- **React Router** (Điều hướng SPA)
- **Axios** (Gọi API Backend)
- **Custom Hooks** (Tái cấu trúc Logic Data)

**Backend (Máy chủ & Cơ sở dữ liệu):**
- **Node.js** & **Express.js** (Xây dựng RESTful API)
- **MongoDB** & **Mongoose** (Lưu trữ và truy vấn dữ liệu linh hoạt)
- **JWT (JSON Web Token)** (Xác thực và phân quyền người dùng)
- **Bcrypt** (Mã hóa mật khẩu)

---

## Tính năng Nổi bật

### 1. Xác thực & Phân quyền
- **Đăng nhập / Đăng ký**: Quản lý tài khoản người dùng an toàn.
- **Bảo mật JWT**: Hệ thống tự động tạo Access Token và Refresh Token, chặn mọi truy cập trái phép vào các API nội bộ.

### 2. Quản lý Workspace (Nhóm / Dự án)
- **Tạo & Quản lý Nhóm**: Người dùng có thể tạo Workspace riêng, mời thành viên tham gia.
- **Vai trò (Leader / Member)**: Phân chia rõ ràng người tạo (Leader) và thành viên (Member).
- **Phân quyền dữ liệu chặt chẽ**: Chỉ các thành viên thuộc Workspace mới có thể xem, tạo, sửa hoặc xóa công việc bên trong Workspace đó (Bảo vệ bằng mã lỗi `403 Forbidden`).

### 3. Task Cá Nhân (Personal Tasks)
- Bên cạnh các công việc thuộc Workspace, hệ thống chính thức hỗ trợ **Công việc Cá nhân**.
- Khi tạo Task, nếu không chọn Workspace, nó sẽ trở thành Task bí mật của riêng bạn, không ai khác có quyền truy cập.
- **Smart Tags (Nhãn thông minh)**: Giao diện tự động phân tích và dán nhãn hiển thị Tên Workspace hoặc chữ "CÁ NHÂN" để dễ dàng phân biệt.

### 4. Bảng Kanban Tương tác
- **Kéo - Thả (Drag & Drop)**: Trải nghiệm kéo thả mượt mà để chuyển đổi trạng thái công việc (TO DO ➜ IN PROGRESS ➜ COMPLETED).
- **Kanban Nhóm**: Xem riêng công việc của một Dự án/Workspace.
- **Kanban Tổng hợp**: Màn hình "Công việc của tôi" gom toàn bộ Task (của các Workspace + Cá nhân) vào một nơi để dễ quản lý.

### 5. Giao diện Hiện đại (UX/UI)
- Giao diện **Dark Theme** với các điểm nhấn màu xanh (`#2DD480`).
- **Modal Popup**: Cửa sổ nổi tạo Công việc, hiển thị ngay trên bảng Kanban mà không cần chuyển trang.
- Dialog cảnh báo thông minh, thông báo lỗi trực quan.

---

## 📂 Cấu trúc Thư mục Chính

```bash
Task-Manager/
│
├── frontend/                 # Ứng dụng Client (React + TypeScript)
│   ├── src/
│   │   ├── components/       # Các UI Component (Form, Modal, KanbanBoard,...)
│   │   ├── hooks/            # Logic Data (useTasks, ...)
│   │   ├── interfaces/       # Định nghĩa TypeScript Types
│   │   ├── pages/            # Các trang chính (Dashboard, Auth, Workspace, ...)
│   │   └── services/         # Tích hợp API gọi Backend
│   └── package.json
│
└── backend/                  # Máy chủ API (Express + MongoDB)
    ├── config/               # Cấu hình Môi trường (Environment, DB)
    ├── controller/           # Logic xử lý API (Task, Workspace, Auth)
    ├── middleware/           # Trạm trung chuyển (Check JWT, Error handler)
    ├── model/                # Mongoose Schema
    ├── routes/               # API Router
    └── package.json
```

---

## Hướng dẫn Cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- **Node.js** (Phiên bản v18 trở lên)
- **MongoDB** (Local hoặc MongoDB Atlas)

### 2. Thiết lập Backend
```bash
cd backend
npm install
```
- Tạo file `.env` (hoặc `.env.local`) trong thư mục `backend/secrets` (hoặc thư mục gốc backend) như file `.env.example`.
```
- Chạy Server:
```bash
npm start
```
*(Server mặc định sẽ chạy ở `http://localhost:3000`)*

### 3. Thiết lập Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Frontend mặc định sẽ chạy ở `http://localhost:5173`)*
