# Lịch sử thay đổi (Changelog) - Ngày 01/06/2026

Tài liệu này ghi nhận lại toàn bộ các tính năng mới và các tối ưu hóa kiến trúc (refactoring) đã được thực hiện trong dự án **Task Manager**.

## 1. Tính Năng Mới: Bảng Kanban dành riêng cho Workspace
- **Backend**:
  - Sửa lỗi trong API tạo Task (`createTask`): Cập nhật lưu đúng giá trị `creatorId` (người tạo) và `workspaceId` (ID của nhóm) tương thích với thiết kế `TaskModel`.
  - Thêm mới API `getTasksByWorkspace` trong `taskController` và đăng ký route `GET /api/tasks/workspace/:workspaceId` để lấy danh sách công việc theo từng nhóm riêng biệt.
- **Frontend**:
  - Trang danh sách nhóm (`WorkspacePage.tsx`): Biến mỗi thẻ nhóm thành một đường dẫn click được.
  - Tạo trang mới `WorkspaceKanban.tsx`: Hiển thị bảng kéo-thả công việc dành riêng cho một Workspace cụ thể. Bảng tự động tải dữ liệu dựa trên ID trên URL.

## 2. Tính Năng Mới: Modal Tạo Công Việc (Create Task Popup)
- **Thay đổi UX/UI**: Chuyển đổi tính năng tạo công việc từ một trang tĩnh (chuyển hướng qua route `/todoapp/newTask`) thành một cửa sổ nổi (Modal Popup).
- **Frontend**:
  - Tạo mới component `CreateTaskModal.tsx` đóng vai trò là màn che mờ (backdrop) bao quanh form tạo việc.
  - Cập nhật cả `TasksPage` và `WorkspaceKanban`: Nhấp vào "Create New Task" sẽ hiển thị Popup thay vì rời khỏi trang hiện tại. Tự động tải lại danh sách sau khi tạo thành công.
  - Xử lý mượt mà việc gắn tự động `workspaceId` vào form tạo nếu người dùng đang ở trong trang WorkspaceKanban.

## 3. Cải Thiện UI: Đồng bộ Tông Màu Chủ Đạo
- **Confirm Dialog**: Cập nhật hoàn toàn giao diện hộp thoại xác nhận (được dùng để cảnh báo khi người dùng nhấn "Hủy bỏ" trong lúc tạo task). 
- Chuyển từ màu mặc định (nền trắng) sang tông tối: nền `#18261F`, chữ trắng/xám, và sử dụng màu xanh đặc trưng `#2DD480` của ứng dụng làm điểm nhấn (accent).

## 4. Tái Cấu Trúc Mã Nguồn (Refactor Frontend)
Để codebase sạch sẽ, dễ bảo trì và mở rộng trong tương lai, các thay đổi kiến trúc sau đã được áp dụng:
- **Tập trung hóa Interfaces (DRY)**: Đưa các kiểu dữ liệu `Task`, `Status`, `Priority` từ các trang đơn lẻ gom chung vào file `src/interfaces/task.ts`.
- **Tạo Reusable Component (`KanbanBoard.tsx`)**: Tách logic render 3 cột kéo-thả khỏi `TasksPage` và `WorkspaceKanban`. Giảm kích thước các file UI từ hơn 160 dòng xuống còn dưới 50 dòng.
- **Tách biệt Logic Dữ Liệu (`useTasks.ts` custom hook)**: Toàn bộ code gọi API, xử lý loading, error, và drop task được tách ra thành một Custom Hook độc lập. Các file giao diện chỉ tập trung vào việc render.
- **Tổ Chức Thư Mục Component**: Phân chia rạch ròi bằng cách tạo thêm `src/components/common/`. Chuyển các component dùng chung (Sidebar, ConfirmDialog, InputField, FeatureUnderDevelopment) vào thư mục này để dễ quản lý.
