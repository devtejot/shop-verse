"use client";
import { useUserPrefsStore } from "@/stores/userPrefsStore";
import { ShoppingFor, BudgetRange, PrimaryUse } from "@/types/userPrefs";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STEPS = [
  {
    id: "shoppingFor",
    question: "Quick one — who's this for?",
    options: [
      { value: "myself", label: "Just me", desc: "Treating myself" },
      { value: "gift", label: "A gift", desc: "Someone's going to love it" },
      { value: "work", label: "Work stuff", desc: "Desk, meetings, the usual" },
      {
        value: "family",
        label: "The family",
        desc: "Shared or gifting around",
      },
    ],
  },
  {
    id: "budget",
    question: "How much are you thinking?",
    options: [
      { value: "budget", label: "Under $300", desc: "Value is the vibe" },
      { value: "mid", label: "$300 – $800", desc: "Room to be picky" },
      { value: "premium", label: "Over $800", desc: "Going all in" },
      { value: "any", label: "Not sure yet", desc: "Show me options" },
    ],
  },
  {
    id: "primaryUse",
    question: "What do you mostly shop for?",
    options: [
      { value: "home", label: "Home & living", desc: "Cozy and practical" },
      { value: "style", label: "Style & fashion", desc: "Everyday outfits" },
      {
        value: "beauty",
        label: "Beauty & wellness",
        desc: "Care and glow",
      },
      { value: "outdoors", label: "Outdoor & travel", desc: "On the go" },
    ],
  },
] as const;

export function MoodQuiz() {
  const { quizCompleted, completeQuiz, skipQuiz } = useUserPrefsStore();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{
    shoppingFor: ShoppingFor | null;
    budget: BudgetRange | null;
    primaryUse: PrimaryUse | null;
  }>({ shoppingFor: null, budget: null, primaryUse: null });

  useEffect(() => {
    if (!quizCompleted) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, [quizCompleted]);

  if (!visible || quizCompleted) return null;

  const currentStep = STEPS[step];

  function handleSelect(value: string) {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers as typeof answers);

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      setTimeout(() => {
        completeQuiz({
          shoppingFor: newAnswers.shoppingFor!,
          budget: newAnswers.budget!,
          primaryUse: newAnswers.primaryUse!,
        });
        setVisible(false);
      }, 350);
    }
  }

  function handleDismiss() {
    skipQuiz();
    setVisible(false);
  }

  return visible ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
        onClick={handleDismiss}
      />

      {/* Sheet on mobile, centered dialog on sm+ */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full">
            {/* Drag handle — mobile only cue */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-8 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-4 sm:pt-5 pb-1">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-all duration-500 ${
                      i <= step ? "bg-gray-900" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pt-3 pb-6 sm:pb-5">
              <div key={step}>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 leading-snug">
                  {currentStep.question}
                </h2>

                {/* 1 col on very small screens, 2 col on 380px+ */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                  {currentStep.options.map((opt) => {
                    const selected =
                      answers[currentStep.id as keyof typeof answers] ===
                      opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`text-left px-3.5 py-3 rounded-xl border transition-colors duration-150 ${
                          selected
                            ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <p className="font-medium text-gray-900 text-sm leading-tight">
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="mt-4 text-xs text-gray-400 hover:text-gray-500 transition-colors w-full text-center"
              >
                Skip, just show me products
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
