"use client";

import { useCallback, useRef, useState } from "react";

export type AccordionItem = {
  id: string;
  question: string;
  content: React.ReactNode;
};

type FaqAccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export default function FaqAccordion({ items, className = "" }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const answerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setAnswerHeights = useCallback((activeId: string | null) => {
    items.forEach((item) => {
      const el = answerRefs.current[item.id];
      if (!el) return;
      el.style.maxHeight = activeId === item.id ? `${el.scrollHeight}px` : "";
    });
  }, [items]);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    requestAnimationFrame(() => setAnswerHeights(next));
  };

  return (
    <div className={`faq-container reveal ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div className="faq-item" key={item.id}>
            <button
              type="button"
              className={`faq-question${isOpen ? " active" : ""}`}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              {item.question} <span className="icon">+</span>
            </button>
            <div
              className="faq-answer"
              ref={(el) => {
                answerRefs.current[item.id] = el;
              }}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
