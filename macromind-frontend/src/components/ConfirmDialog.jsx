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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 mb-1">{title}</h2>
            {message && (
              <p className="text-[13px] text-gray-500 leading-relaxed">{message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-200 text-gray-600 text-[13px] font-medium py-2.5 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : null}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}