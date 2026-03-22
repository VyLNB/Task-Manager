import jwt from 'jsonwebtoken';
import env from '../config/environment.js';
import bcrypt from 'bcryptjs';
import User from '../model/UserModel.js';

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        env.JWT_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { userId },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } 
    );

    return { accessToken, refreshToken };
}

export const register = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { email, password, fullName } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu.',
                timestamp: new Date().toISOString()
            });
        }

        // Kiểm tra xem email đã được đăng ký chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
                timestamp: new Date().toISOString()
            });
        }

        // Mã hóa (Hash) mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới với mật khẩu đã mã hóa
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
        });

        // Lưu vào cơ sở dữ liệu
        await newUser.save();

        // Trả về thông báo thành công 
        return res.status(201).json({ // 201 Created
            message: 'Đăng ký tài khoản thành công.',
            data: {
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            message: 'Lỗi server. Vui lòng thử lại sau.',
            timestamp: new Date().toISOString()
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp email và mật khẩu.',
                timestamp: new Date().toISOString()
            });
        };

        // Tìm user theo email
        const user = await User.findOne({ email });
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isMatch) {
            return res.status(401).json({
                message: 'Email hoặc mật khẩu không đúng.',
                timestamp: new Date().toISOString()
            });
        }

        //  Tạo token
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        const userData = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        };

        return res.status(200).json({
            message: 'Đăng nhập thành công.',
            data: {
                user: userData,
                accessToken
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Lỗi server. Vui lòng thử lại sau.',
            timestamp: new Date().toISOString()
        });
    }
};

