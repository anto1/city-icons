interface FAQ {
  question: string;
  answer: string;
}

interface FAQContentProps {
  faqs: FAQ[];
}

export function FAQContent({ faqs }: FAQContentProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden"
          >
            <dt className="px-6 py-4 bg-muted/30">
              <span className="font-medium text-foreground">{faq.question}</span>
            </dt>
            <dd className="px-6 py-4 text-muted-foreground">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
