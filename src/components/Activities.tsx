import { TIMELINE } from "@/data/site";
import Reveal from "./Reveal";

export default function Activities() {
  return (
    <section id="kegiatan" className="activities bg-light">
      <div className="container">
        <h2 className="section-title reveal">Daily Routine Gue</h2>
        <p className="section-subtitle reveal">
          Meskipun jadwalnya lumayan padat, tapi seru kok! Penasaran ngapain aja seharian di pondok? Cekidot!
        </p>
        <Reveal className="timeline reveal">
          {TIMELINE.map((item) => (
            <div className="timeline-item" key={item.time}>
              <div className="time">{item.time}</div>
              <div className="content">
                <h4>{item.title}</h4>
                <p>
                  {item.description}
                  {"italicCharge" in item && item.italicCharge && (
                    <>
                      {" "}
                      <em>Charge</em> energi buat besok!
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
