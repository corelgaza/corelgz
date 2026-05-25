import { FAQ_PONDOK } from "@/data/site";
import FaqAccordion, { type AccordionItem } from "./FaqAccordion";
import Reveal from "./Reveal";

export default function FaqSection() {
  const items: AccordionItem[] = FAQ_PONDOK.map((faq, i) => ({
    id: `pondok-${i}`,
    question: faq.question,
    content: <p>{faq.answer}</p>,
  }));

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="section-title reveal">FAQ Pondok</h2>
        <p className="section-subtitle reveal">
          Pertanyaan yang sering banget ditanyain ke gue.
        </p>
        <Reveal>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
