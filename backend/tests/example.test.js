// Đây là cú pháp cơ bản của Jest

// 'describe' dùng để nhóm các test liên quan lại với nhau (ví dụ: test cho 1 file hoặc 1 tính năng)
describe('Ví dụ test cơ bản', () => {
    
    // 'it' hoặc 'test' là một trường hợp cần kiểm tra (test case) cụ thể
    it('Nên tính tổng 2 số chính xác', () => {
        // 1. Arrange: Chuẩn bị dữ liệu đầu vào
        const a = 5;
        const b = 10;

        // 2. Act: Chạy hàm cần test
        const tong = a + b;

        // 3. Assert: Kiểm tra xem kết quả có đúng như mong đợi không
        expect(tong).toBe(10); 
    });

});
