import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Camera,
  Bot,
  User,
  Loader2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  analyzeMeal,
  analyzeMealPhoto,
  getAnalysisQuota,
} from "../api/mealApi";
import { useChatStore } from "../store/chatStore";

function NutritionCard({ food }) {
  return (
    <div className="bg-brand-50 rounded-lg p-3 mt-2 border border-brand-100">
      <p className="text-[12.5px] font-semibold text-brand-700 mb-2">
        {food.name}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Calories", val: food.calories, unit: "kcal" },
          { label: "Protein", val: food.protein, unit: "g" },
          { label: "Carbs", val: food.carbs, unit: "g" },
          { label: "Fat", val: food.fat, unit: "g" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-[13px] font-semibold text-brand-700">
              {m.val}
              <span className="text-[10px] font-normal">{m.unit}</span>
            </p>
            <p className="text-[10px] text-brand-500">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function foodLines(foods = []) {
  return foods
    .map((f) => `• ${f.quantity ? `${f.quantity} ` : ""}${f.name}`)
    .join("\n");
}

const DAILY_LIMIT = 3;
const MAX_MEAL_TEXT_LENGTH = 100;

const QUOTA_MESSAGE =
  "You've used all 3 AI meal analyses for today. Your quota resets at midnight IST. You can still review your existing chat and saved meals.";

export default function ChatPanel({ compact = false, onAnalysisReady }) {
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState(null);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [quotaError, setQuotaError] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const refreshQuota = useCallback(async () => {
    try {
      const res = await getAnalysisQuota();
      const nextQuota = res.data;

      setQuota(nextQuota);
      setQuotaError(false);
      setQuotaExceeded(nextQuota.remaining <= 0);
    } catch (error) {
      console.error("Failed to load analysis quota:", error);
      setQuotaError(true);
    } finally {
      setQuotaLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isQuotaExceeded = (error) =>
    error.response?.data?.code === "DAILY_ANALYSIS_LIMIT_REACHED";

  const handleQuotaExceeded = () => {
    setQuotaExceeded(true);

    setQuota((current) =>
      current
        ? {
            ...current,
            used: current.limit,
            remaining: 0,
          }
        : {
            used: DAILY_LIMIT,
            limit: DAILY_LIMIT,
            remaining: 0,
          },
    );

    addMessage({
      role: "assistant",
      text: QUOTA_MESSAGE,
      type: "quota",
    });
  };

  const send = async () => {
    if (
      !input.trim() ||
      input.trim().length > MAX_MEAL_TEXT_LENGTH ||
      loading ||
      quotaLoading ||
      quotaError ||
      quotaExceeded ||
      quota?.remaining === 0
    ) {
      return;
    }

    const userMsg = input.trim();

    setInput("");
    addMessage({ role: "user", text: userMsg });
    setLoading(true);

    try {
      const res = await analyzeMeal(userMsg);
      const analysis = res.data;

      addMessage({
        role: "assistant",
        text: `Meal analysed. I detected:\n${foodLines(analysis.foods)}`,
        foods: analysis.foods,
        outro: "Review the meal on the right and press Save when you're ready.",
      });

      onAnalysisReady?.(analysis, userMsg);
      await refreshQuota();
    } catch (error) {
      console.error("Meal analysis failed:", error);

      if (isQuotaExceeded(error)) {
        handleQuotaExceeded();
      } else {
        addMessage({
          role: "assistant",
          text:
            error.response?.data?.message ||
            "I couldn't analyse that meal. Please try describing it again.",
        });
      }

      await refreshQuota();
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (
      !file ||
      loading ||
      quotaLoading ||
      quotaError ||
      quotaExceeded ||
      quota?.remaining === 0
    ) {
      return;
    }

    addMessage({ role: "user", text: `📷 Uploaded ${file.name}` });
    setLoading(true);

    try {
      const res = await analyzeMealPhoto(file);
      const analysis = res.data;

      addMessage({
        role: "assistant",
        text: `Photo analysed. I detected:\n${foodLines(analysis.foods)}`,
        foods: analysis.foods,
        outro: "Review the meal on the right and press Save when you're ready.",
      });

      onAnalysisReady?.(analysis, "Photo meal");
      await refreshQuota();
    } catch (error) {
      console.error("Photo analysis failed:", error);

      if (isQuotaExceeded(error)) {
        handleQuotaExceeded();
      } else {
        addMessage({
          role: "assistant",
          text:
            error.response?.data?.message ||
            "I couldn't analyse that photo. Please try again.",
        });
      }

      await refreshQuota();
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const limitReached = quotaExceeded || quota?.remaining === 0;

  const analysisDisabled =
    loading || quotaLoading || quotaError || limitReached;

  const quotaBadgeClass = limitReached
    ? "border-red-200 bg-red-50 text-red-700"
    : quota?.remaining === 1
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-brand-100 bg-brand-50 text-brand-700";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 flex flex-col ${
        compact ? "h-full" : "h-[600px]"
      }`}
    >
      {/* Chat header and daily quota counter */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-brand-400 flex items-center justify-center shrink-0">
          <Bot size={13} className="text-white" />
        </div>

        <span className="text-[13px] font-semibold text-gray-800">
          AI Nutrition Assistant
        </span>

        <div
          className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ${quotaBadgeClass}`}
          title="Your daily AI meal analysis quota"
          aria-live="polite"
        >
          <Sparkles size={12} />

          {quotaLoading
            ? "Loading…"
            : quotaError
              ? "Quota unavailable"
              : `${quota?.remaining ?? 0}/${quota?.limit ?? DAILY_LIMIT} left`}
        </div>
      </div>

      {/* Quota-exceeded notification */}
      {limitReached && (
        <div className="mx-4 mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700 shrink-0">
            <AlertTriangle size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Daily AI limit reached
            </p>

            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              You&apos;ve used all 3 analyses for today. Your quota resets at
              midnight IST. You can continue reviewing your existing chat and
              saved meals.
            </p>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                msg.role === "user" ? "bg-gray-100" : "bg-brand-50"
              }`}
            >
              {msg.role === "user" ? (
                <User size={12} className="text-gray-500" />
              ) : (
                <Bot size={12} className="text-brand-600" />
              )}
            </div>

            <div
              className={`max-w-[80%] ${
                msg.role === "user" ? "items-end" : "items-start"
              } flex flex-col gap-1`}
            >
              <div
                className={`rounded-xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-brand-400 text-white rounded-tr-sm"
                    : msg.type === "quota"
                      ? "bg-amber-50 border border-amber-100 text-amber-900 rounded-tl-sm"
                      : "bg-gray-50 text-gray-700 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>

              {msg.foods?.map((food, j) => (
                <NutritionCard key={j} food={food} />
              ))}

              {msg.outro && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[11.5px] text-amber-700 leading-relaxed">
                  💡 {msg.outro}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
              <Bot size={12} className="text-brand-600" />
            </div>

            <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
              <Loader2 size={12} className="text-brand-400 animate-spin" />
              <span className="text-[12px] text-gray-400">
                Analysing meal...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Text and photo input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-end gap-2">
          <div
            className={`flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 transition-all ${
              !analysisDisabled
                ? "focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-50"
                : "opacity-70"
            }`}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={analysisDisabled}
              maxLength={MAX_MEAL_TEXT_LENGTH}
              placeholder={
                limitReached
                  ? "Daily analysis limit reached — come back tomorrow."
                  : quotaError
                    ? "Unable to check quota. Please refresh the page."
                    : "e.g. I ate 2 idlis and sambar..."
              }
              rows={2}
              className="w-full bg-transparent text-[13px] text-gray-800 placeholder-gray-400 resize-none outline-none disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span
              aria-live="polite"
              className={`text-[10px] tabular-nums ${
                input.length >= MAX_MEAL_TEXT_LENGTH
                  ? "text-red-600 font-semibold"
                  : input.length >= 90
                    ? "text-amber-600"
                    : "text-gray-400"
              }`}
            >
              {input.length}/{MAX_MEAL_TEXT_LENGTH}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              disabled={analysisDisabled}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={analysisDisabled}
              aria-label="Upload meal photo"
              title={
                limitReached
                  ? "Daily analysis limit reached"
                  : "Analyse a meal photo"
              }
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Camera size={14} />
            </button>

            <button
              type="button"
              onClick={send}
              disabled={!input.trim() || analysisDisabled}
              aria-label="Analyse meal"
              title={
                limitReached ? "Daily analysis limit reached" : "Analyse meal"
              }
              className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={13} />
            </button>
          </div>
        </div>

        {quotaError && (
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-red-600">
            <span>
              Could not load your quota. Analysis is temporarily disabled.
            </span>

            <button
              type="button"
              onClick={() => {
                setQuotaLoading(true);
                refreshQuota();
              }}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <p className="text-[10.5px] text-gray-400 mt-2 text-center">
          Nutrition values are AI estimates. Consult a dietitian for medical
          advice.
        </p>
      </div>
    </div>
  );
}
