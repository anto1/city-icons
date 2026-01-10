'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQContentProps {
  faqs: FAQ[];
}

export function FAQContent({ faqs }: FAQContentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <dl className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden"
          >
            <dt>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </dt>
            <dd
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 text-muted-foreground">
                {faq.answer}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
