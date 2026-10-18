import { useEffect, useState } from "react";
import {
  Bug,
  ImagePlus,
  X,
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { usePageTitle } from "../hooks/usePageTitle";
import { submitBugReport } from "../api/bugReportApi";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function BugReport() {
  usePageTitle("Report Bug / Issues");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    setFeedback(null);

    const remaining = MAX_FILES - files.length;

    if (remaining <= 0) {
      setFeedback({
        type: "error",
        message: `You can attach up to ${MAX_FILES} screenshots.`,
      });
      return;
    }

    const accepted = [];
    let rejected = 0;

    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        rejected++;
        continue;
      }

      if (files.length + accepted.length >= MAX_FILES) {
        rejected++;
        continue;
      }

      accepted.push(file);
    }

    setFiles((current) => [...current, ...accepted]);

    if (rejected > 0) {
      setFeedback({
        type: "error",
        message:
          "Some files were skipped. Use PNG, JPG, or WEBP images up to 5 MB each, with a maximum of 3 screenshots.",
      });
    }
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!title.trim() || !description.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter both a title and description.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      await submitBugReport({
        title: title.trim(),
        description: description.trim(),
        screenshots: files,
      });

      setTitle("");
      setDescription("");
      setFiles([]);

      setFeedback({
        type: "success",
        message: "Your report has been submitted successfully. Thank you!",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "We couldn't submit your report. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar
        title="Report Bug / Issues"
        subtitle="Help us make MacroMind better"
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Bug size={22} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Something not working?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tell us what happened. Screenshots help us understand and
                  reproduce the issue.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="bug-title"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Issue title <span className="text-red-500">*</span>
                </label>

                <input
                  id="bug-title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setFeedback(null);
                  }}
                  maxLength={150}
                  required
                  placeholder="e.g. Calories are not updating"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />

                <p className="text-xs text-gray-400 mt-1 text-right">
                  {title.length}/150
                </p>
              </div>

              <div>
                <label
                  htmlFor="bug-description"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="bug-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setFeedback(null);
                  }}
                  maxLength={5000}
                  required
                  rows={6}
                  placeholder="What happened? What did you expect to happen? What steps led to the issue?"
                  className="w-full resize-y border border-gray-200 rounded-lg px-3.5 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />

                <p className="text-xs text-gray-400 mt-1 text-right">
                  {description.length}/5000
                </p>
              </div>

              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Screenshots{" "}
                    <span className="font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, or WEBP · Up to 5 MB per image · Maximum 3
                  </p>
                </div>

                <label
                  htmlFor="bug-screenshots"
                  className={`flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-6 text-center transition-colors ${
                    files.length >= MAX_FILES
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:border-brand-400 hover:bg-brand-50/40"
                  }`}
                >
                  <ImagePlus size={24} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Add screenshots
                  </span>
                  <span className="text-xs text-gray-400">
                    Select images from your device
                  </span>

                  <input
                    id="bug-screenshots"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    disabled={files.length >= MAX_FILES}
                    onChange={handleFiles}
                    className="sr-only"
                  />
                </label>

                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="relative border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-28 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          aria-label={`Remove ${file.name}`}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white/95 text-gray-700 shadow hover:text-red-600"
                        >
                          <X size={14} />
                        </button>

                        <p className="px-2 py-1.5 text-xs text-gray-500 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {feedback && (
                <div
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                    feedback.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !description.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {submitting ? "Submitting..." : "Submit report"}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400">
            Thank you for helping improve MacroMind.
          </p>
        </div>
      </div>
    </div>
  );
}
