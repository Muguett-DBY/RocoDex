"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";

type DecryptedTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  text: string;
  /** 每个字符的加密间隔（ms） */
  speed?: number;
  maxIterations?: number;
  /** 顺序逐个解密，还是整体乱码抖动后一次解出 */
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  /** view = 进入视口时解一次；hover = 悬停解密/离开还原 */
  animateOn?: "view" | "hover";
};

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

/**
 * 解密文字：乱码逐步还原为明文，带"系统解码"质感。
 * 纯 React 实现（ReactBits DecryptedText 适配版，去掉 motion 依赖）。
 */
export function DecryptedText({
  text,
  speed = 45,
  maxIterations = 8,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARACTERS,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
        : characters.split(""),
    [useOriginalCharsOnly, text, characters],
  );

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) =>
      originalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (currentRevealed.has(index)) return originalText[index];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(""),
    [availableChars],
  );

  const getNextIndex = useCallback(
    (revealedSet: Set<number>): number => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLength - 1 - revealedSet.size;
        default: {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let index = 0; index < textLength; index++) {
            if (!revealedSet.has(index)) return index;
          }
          return 0;
        }
      }
    },
    [text.length, revealDirection],
  );

  const triggerDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set());
    setDisplayText(shuffleText(text, new Set()));
    setIsAnimating(true);
  }, [isAnimating, text, shuffleText]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;
    intervalRef.current = setInterval(() => {
      setRevealedIndices((previous) => {
        if (sequential) {
          if (previous.size < text.length) {
            const nextIndex = getNextIndex(previous);
            const next = new Set(previous);
            next.add(nextIndex);
            setDisplayText(shuffleText(text, next));
            return next;
          }
          clearInterval(intervalRef.current ?? undefined);
          setIsAnimating(false);
          setDisplayText(text);
          return previous;
        }

        currentIteration += 1;
        if (currentIteration >= maxIterations) {
          clearInterval(intervalRef.current ?? undefined);
          setIsAnimating(false);
          setDisplayText(text);
          return new Set(text.split("").map((_, index) => index));
        }
        setDisplayText(shuffleText(text, previous));
        return previous;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, text, speed, maxIterations, sequential, getNextIndex, shuffleText]);

  useEffect(() => {
    if (animateOn !== "view") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerDecrypt();
            setHasAnimated(true);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.2 },
    );

    const current = containerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const hoverHandlers =
    animateOn === "hover"
      ? { onMouseEnter: triggerDecrypt, onMouseLeave: resetToPlainText }
      : {};

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...hoverHandlers}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index) || !isAnimating;
          return (
            <span key={index} className={isRevealed ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
