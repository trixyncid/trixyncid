"use client";

import { useState } from "react";
import { FaqAccordionItem } from "@/features/faq/faq-accordion-item";

type HomeFaqListProps = {
  items: { id: string; question: string; answer: string }[];
};

/** The home page's questions as the FAQ page's accordion, one open at a time, first open. */
export function HomeFaqList({ items }: HomeFaqListProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.id} className="reveal">
          <FaqAccordionItem
            question={item.question}
            answer={item.answer}
            isOpen={openId === item.id}
            onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
          />
        </div>
      ))}
    </div>
  );
}
