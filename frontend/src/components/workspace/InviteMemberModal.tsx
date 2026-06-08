import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string) => Promise<void>;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return;
        }

        try {
            setIsSubmitting(true);
            await onInvite(email);
            setEmail('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi mời thành viên');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#18261F] rounded-2xl w-full max-w-md relative shadow-2xl border border-[#283b2e] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#283b2e]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-[#2DD480]" size={24} />
                        Invite Member
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-[#8a9f91] mb-6 text-sm">
                        Nhập email của người dùng mà bạn muốn mời vào Workspace này.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-xl mb-4 border border-red-500/20 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-white text-sm font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full p-3.5 bg-[#0d1511] text-white border-2 border-[#283b2e] rounded-xl focus:outline-none focus:border-[#2DD480] transition-colors placeholder:text-gray-600"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-[#8a9f91] font-bold hover:bg-[#283b2e] hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            className="flex-1 py-3 rounded-xl bg-[#2DD480] text-[#0d1511] font-bold hover:bg-[#25b56d] disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(45,212,128,0.15)] flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0d1511] border-t-transparent" />
                            ) : (
                                'Send Invite'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
