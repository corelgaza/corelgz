import { QUOTE } from "@/data/site";
import Reveal from "./Reveal";

export default function Quotes() {
  return (
    <section id="quotes" className="quotes-section">
      <div className="container">
        <Reveal>
          <blockquote className="islamic-quote">
            &ldquo;{QUOTE.text}&rdquo;
            <cite>{QUOTE.cite}</cite>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
