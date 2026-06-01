import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useRef } from "react";
import { BsExclamationTriangle } from "react-icons/bs";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "info" | "warning";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  const cancelBtnRef = useRef(null);

  const getIconBgColor = () => {
    if (variant === "danger") return "bg-red-500/20";
    if (variant === "warning") return "bg-yellow-500/20";
    return "bg-[#2DD480]/20";
  };

  const getIconColor = () => {
    if (variant === "danger") return "text-red-500";
    if (variant === "warning") return "text-yellow-500";
    return "text-[#2DD480]";
  };

  const getButtonColor = () => {
    if (variant === "danger") return "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent";
    if (variant === "warning") return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white border-transparent";
    return "bg-[#2DD480] hover:bg-[#25b56d] text-[#0D1511] focus:ring-[#2DD480] font-bold border-transparent";
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[9999] focus:outline-none"
      onClose={onClose}
      initialFocus={cancelBtnRef}
    >
      {/* Màn che mờ phía sau (Backdrop) */}
      <div className="fixed inset-0 bg-black/70 transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-xl bg-[#18261F] border border-gray-700 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {/* Icon cảnh báo */}
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${getIconBgColor()}`}
                    >
                      <BsExclamationTriangle
                        className={`h-6 w-6 ${getIconColor()}`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Nội dung text */}
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-bold leading-6 text-white"
                      >
                        {title}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">{message}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Các nút bấm hành động */}
                <div className="bg-[#131E18] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-800">
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                        ${getButtonColor()}
                        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                    onClick={onConfirm}
                  >
                    {isLoading ? "Đang xử lý..." : confirmText}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-600 bg-transparent px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                    onClick={onClose}
                    ref={cancelBtnRef}
                  >
                    {cancelText}
                  </button>
                </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
