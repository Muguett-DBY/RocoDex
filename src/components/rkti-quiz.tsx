"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dimensions, questions, scoresToCode, generateAnalysis, type DimensionScores } from "@/data/rkti";
import type { RktiResult } from "@/data/rkti";
import { RktiResultCard } from "@/components/rkti-result";

type Phase = "intro" | "quiz" | "result";

export function RktiQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<DimensionScores>({
    battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0,
  });
  const [result, setResult] = useState<RktiResult | null>(null);

  const handleAnswer = useCallback((optionScores: DimensionScores) => {
    const newScores = { ...scores };
    for (const key of Object.keys(optionScores) as (keyof DimensionScores)[]) {
      newScores[key] += optionScores[key];
    }
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const code = scoresToCode(newScores);
      const analysis = generateAnalysis(code);
      setResult(analysis);
      setPhase("result");
    }
  }, [currentQuestion, scores]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const reset = useCallback(() => {
    setPhase("intro");
    setCurrentQuestion(0);
    setScores({ battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 });
    setResult(null);
  }, []);

  if (phase === "intro") {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            洛克测试
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            RKT I
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-700">
            Roco Kingdom Type Indicator
          </p>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            24 道情景选择题，从战斗风格、冒险态度、社交倾向、培育理念等多个维度深入探索你的训练师人格，
            最终为你找到那只命中注定的本命精灵。
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
            {dimensions.map((dim) => (
              <div key={dim.key} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs font-semibold text-slate-500">{dim.label}</div>
                <div className="mt-1 text-sm text-slate-800">
                  {dim.emoji} {dim.left} · {dim.right}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-400">
            预计用时 3-5 分钟 · 结果仅供参考娱乐
          </p>

          <Button
            onClick={() => setPhase("quiz")}
            className="mt-6 h-12 px-10 text-base"
          >
            开始测试
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <RktiResultCard result={result} scores={scores} onRetake={reset} />
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>第 {currentQuestion + 1} / {questions.length} 题</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {dimensions.find((d) => d.key === q.dimension)?.label}
          </div>
          <h2 className="mb-8 text-xl font-bold text-slate-950">
            {q.text}
          </h2>

          <div className="space-y-3">
            {q.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAnswer(option.scores)}
                className="w-full text-left transition"
              >
                <Card className="cursor-pointer p-4 transition hover:border-emerald-300 hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <p className="text-sm leading-6 text-slate-700">{option.text}</p>
                  </div>
                </Card>
              </button>
            ))}
          </div>

          {currentQuestion > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="mt-6 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              上一题
            </button>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
