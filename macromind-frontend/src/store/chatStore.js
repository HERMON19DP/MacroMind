import { create } from "zustand";

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

export const useChatStore = create((set) => ({
  messages: [initialMessage],
  analysis: null,
  mealType: guessMealType(),

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
    }),
}));