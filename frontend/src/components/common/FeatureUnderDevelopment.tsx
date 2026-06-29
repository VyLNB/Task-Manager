import { Bell, ArrowLeft } from 'lucide-react';

const FeatureUnderDevelopment = () => {

    return (
        <div className="min-h-screen bg-[#0f1f1b] flex items-center justify-center p-4 font-sans">
            {/* Card Container */}
            <div className="max-w-lg w-full bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 text-center border border-teal-800/50">

                {/* Badge */}
                <div className="flex justify-center mb-4">
                    <span className="bg-teal-900/40 text-teal-400 border border-teal-800/50 px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                        Coming Soon
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    Tính năng này đang được phát triển!
                </h2>

                {/* Description */}
                <p className="text-teal-200/60 mb-8 leading-relaxed">
                    Chúng tôi đang nỗ lực để hoàn thiện tính năng này giúp việc quản lý cửa hàng của bạn dễ dàng hơn. Xin vui lòng quay lại sau!
                </p>

                {/* Form Section */}
                <div className="space-y-3 mb-8 text-left">
                    <label className="block text-sm font-medium text-white ml-1">
                        Nhận thông báo khi hoàn tất
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="nhap-email-cua-ban@example.cc"
                            className="flex-1 bg-[#0f1f1b] border border-teal-700 text-teal-100 placeholder:text-teal-200/40 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none transition-all"
                        />
                        <button className="bg-teal-500 hover:bg-teal-400 text-[#0f1f1b] font-bold rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                            <Bell size={18} />
                            <span className="whitespace-nowrap">Nhận thông báo</span>
                        </button>
                    </div>

                    <p className="text-xs text-teal-200/40 ml-1">
                        *Chúng tôi sẽ không gửi spam.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-teal-800/50 flex-1"></div>
                    <span className="text-teal-200/40 text-sm font-medium">hoặc</span>
                    <div className="h-px bg-teal-800/50 flex-1"></div>
                </div>

                {/* Back Link */}
                <div>
                    <a href="/main/tasks" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
                        <ArrowLeft size={18} />
                        Quay lại trang chủ
                    </a>

                </div>

            </div>
        </div>
    );
};

export default FeatureUnderDevelopment;