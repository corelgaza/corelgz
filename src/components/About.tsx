import { BIODATA } from "@/data/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="tentang" className="about">
      <div className="container">
        <h2 className="section-title reveal">About Me</h2>
        <Reveal className="about-grid reveal">
          <div className="about-text">
            <h3>Halo Semuanya! 👋</h3>
            <p>
              Kenalin, gue Corel. Barudak Sukahideng mah pasti udah pada kenal lah ya, hehe. Sekarang gue lagi
              asik mondok nih. Serius deh, ngabisin masa muda di pesantren tuh pengalaman berharga yang nggak
              bakal gue sesalin. Di sini gue nggak cuma belajar ngaji, tapi juga belajar mandiri, hidup
              sederhana, dan pastinya dapet banyak banget temen asik.
            </p>
            <p>
              Awalnya sih jujur berat banget ya pisah dari ortu. Tapi lama-lama, temen-temen santri di sini
              udah kayak keluarga sendiri. Mulai dari kebangun sahur bareng, setoran hafalan Al-Qur&apos;an, sampai
              cerita-cerita receh sebelum tidur, haha.
            </p>
          </div>
          <div className="about-card">
            <h4>Biodata Singkat</h4>
            <ul>
              {BIODATA.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
