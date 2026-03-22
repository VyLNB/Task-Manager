import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/inputField';
import { signin } from '../../api/auth';



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
      console.log("Login response:", response);
      navigate('/todoapp/dashboard'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Login Card */}
      <div className="relative z-10 bg-green-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-4 w-full max-w-sm border border-blue-400/20">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 rounded-2xl p-4 shadow-lg">
            <svg width="60" height="60" viewBox="0 0 100 100" className="text-blue-600">
              <path d="M20,40 Q30,20 40,40 T60,40" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"/>
              <path d="M20,60 Q30,40 40,60 T60,60" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold text-center mb-8">Đăng nhập</h1>

        <div>
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
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-950 text-white font-semibold py-3 rounded-lg transition shadow-lg"
          >
            Đăng nhập
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/20"></div>
          <div className="flex-1 border-t border-white/20"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-white/70 text-sm">
          Chưa có tài khoản?{' '}
          <button className="text-white font-semibold hover:underline" onClick={() => {navigate("/register")}}>
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;