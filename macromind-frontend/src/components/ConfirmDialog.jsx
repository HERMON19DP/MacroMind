import { createPortal } from "react-dom";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={message ? "confirm-dialog-message" : undefined}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle size={16} className="text-red-500" />
          </div>

          <div>
            <h2
              id="confirm-dialog-title"
              className="mb-1 text-[15px] font-semibold text-gray-900"
            >
              {title}
            </h2>

            {message && (
              <p
                id="confirm-dialog-message"
                className="text-[13px] leading-relaxed text-gray-500"
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
