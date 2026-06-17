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
            <div className="bg-[#1a2f2a] rounded-2xl w-full max-w-md relative shadow-2xl border border-teal-800 animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-teal-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-teal-400" size={24} />
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
                    <p className="text-teal-200/60 mb-6 text-sm">
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
                            className="w-full p-3.5 bg-[#0f1f1b] text-white border-2 border-teal-800/50 rounded-xl focus:outline-none focus:border-teal-500 transition-colors placeholder:text-teal-200/40"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-teal-200/60 font-bold hover:bg-teal-900/40 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            className="flex-1 py-3 rounded-xl bg-teal-500 text-[#0f1f1b] font-bold hover:bg-teal-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0f1f1b] border-t-transparent" />
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
