import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialMessage = {
  role: "assistant",
  text: "Hi! Tell me what you ate or drank — I'll calculate the calories and macros instantly. You can also upload a photo of your meal.",
};

function guessMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 19) return "snack";
  return "dinner";
}

function todayKey() {
  return new Date().toDateString(); // e.g. "Mon Aug 18 2026"
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [initialMessage],
      analysis: null,
      mealType: guessMealType(),
      lastActiveDate: todayKey(),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      setAnalysis: (analysis) => set({ analysis }),

      setMealType: (mealType) => set({ mealType }),

      clearAnalysis: () => set({ analysis: null }),

      resetChat: () =>
        set({
          messages: [initialMessage],
          analysis: null,
          mealType: guessMealType(),
          lastActiveDate: todayKey(),
        }),

      // Called once on app load to drop stale (yesterday's) state
      checkNewDay: () => {
        const today = todayKey();
        if (get().lastActiveDate !== today) {
          set({
            messages: [initialMessage],
            analysis: null,
            mealType: guessMealType(),
            lastActiveDate: today,
          });
        }
      },
    }),
    {
      name: "macromind-chat-storage", // localStorage key
      partialize: (state) => ({
        messages: state.messages,
        analysis: state.analysis,
        mealType: state.mealType,
        lastActiveDate: state.lastActiveDate,
      }),
    }
  )
);