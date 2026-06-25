import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { signin } from '../../services/auth';



const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signin({ email, password });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        const roleName = response.data?.user?.role?.name;
        if (roleName === 'Admin') {
           navigate('/todoapp/personnel');
        } else {
           navigate('/todoapp/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-8 border border-red-500/30 bg-red-500/10 rounded-xl m-4">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => navigate("/todoapp/tasks")}
          className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl hover:bg-red-500/30 font-medium transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0f1f1b] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Login Card */}
      <div className="relative z-10 bg-[#1a2f2a]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-4 w-full max-w-sm border border-teal-800/50">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#0f1f1b] rounded-2xl p-4 shadow-[0_0_15px_rgba(20,184,166,0.2)] border border-teal-800/50">
            <svg width="60" height="60" viewBox="0 0 100 100" className="text-teal-400">
              <path d="M20,40 Q30,20 40,40 T60,40" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M20,60 Q30,40 40,60 T60,60" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-8">Đăng nhập</h1>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <InputField
            label="Email"
            type="email"
            value={email}
            placeholder='email@gmail.com'
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Mật khẩu"
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <button className="text-white/80 text-sm hover:text-white transition">
              Quên mật khẩu?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-[#0f1f1b] font-bold py-3 rounded-lg transition shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]"
          >
            Đăng nhập
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/20"></div>
          <div className="flex-1 border-t border-white/20"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-white/70 text-sm">
          Chưa có tài khoản?{' '}
          <button className="text-teal-400 font-semibold hover:underline" onClick={() => { navigate("/register") }}>
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;