import axios, { AxiosError } from "axios";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export async function apiRequest<T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  payload?: unknown
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T> | T>({
      method,
      url: url,
      data: payload,
    });

    const responseData = response.data;
    
    // DEBUG: Log để xem response structure
    console.log('API Response:', responseData);

    // Kiểm tra nếu response có cấu trúc ApiResponse
    if (responseData && typeof responseData === 'object' && 'success' in responseData) {
      const apiResponse = responseData as ApiResponse<T>;
      console.log('Success:', apiResponse.success);
      console.log('Data:', apiResponse.data);
      
      if (apiResponse.success) {
        return apiResponse.data;
      }
      
      throw new Error(
        apiResponse?.message || "Đã xảy ra lỗi không xác định từ máy chủ."
      );
    }
    
    // Nếu backend trả trực tiếp data (không có wrapper)
    console.log('Direct data response');
    return responseData as T;

  } catch (err) {
    console.error('API Request Error:', err);
    
    // Trường hợp khác errors cần can thiệp sâu hơn ở server
    if (axios.isAxiosError(err)) {
      const serverError = (err as AxiosError<ApiResponse>).response
        ?.data;

      console.error('Server Error:', serverError);

      if (serverError) {
        throw new Error(serverError.message || "Lỗi từ máy chủ");
      }

      throw new Error(
        err.message || "Lỗi kết nối mạng hoặc máy chủ không phản hồi."
      );
    }
    throw err;
  }
}