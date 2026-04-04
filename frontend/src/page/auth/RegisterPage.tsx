import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      await signup({ name: username, email, password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/'); // Redirect sau khi đăng ký thành công
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-green-950 flex items-center justify-center p-4 relative overflow-hidden">          
            {/* Register Card */}
            <div className="relative z-10 bg-green-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-4 w-full max-w-sm border border-blue-400/20">
                {/* Logo */}
                <div className="flex justify-center mb-3">
                    <div className="bg-white/90 rounded-2xl p-2 shadow-lg">
                        <svg width="40" height="40" viewBox="0 0 100 100" className="text-blue-600">
                            <path d="M20,40 Q30,20 40,40 T60,40" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"/>
                            <path d="M20,60 Q30,40 40,60 T60,60" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>

                <h1 className="text-white text-2xl font-bold text-center mb-4">Đăng ký</h1>

                <div>
                    {/* Username Input */}
                    <div className="mb-3">
                        <label className="block text-white text-xs font-medium mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="your_username"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                        <label className="block text-white text-xs font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                        <label className="block text-white text-xs font-medium mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        /> 
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-4">
                        <label className="block text-white text-xs font-medium mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        /> 
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-500 hover:bg-green-950 text-white font-semibold py-2.5 text-sm rounded-lg transition shadow-lg"
                    >
                        Đăng ký 
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-white/20"></div>
                </div>

                {/* Login Link */}
                <p className="text-center text-white/70 text-xs">
                    Đã có tài khoản?{' '}
                    <button className="text-white font-semibold hover:underline" onClick={() => {navigate('/')}}>
                        Đăng nhập ngay
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;