import FaqAccordion, { type AccordionItem } from "./FaqAccordion";
import { INFO_PONDOK_KEYS, INFO_PONDOK_QUESTIONS } from "@/data/site";
import Reveal from "./Reveal";

function InfoContent({ id }: { id: (typeof INFO_PONDOK_KEYS)[number] }) {
  switch (id) {
    case "history":
      return (
        <>
          <p>
            Pondok Pesantren Sukahideng, yang berlokasi di Sukarame, Tasikmalaya, didirikan pada tahun 1922 M
            (1341 H) oleh KH Zainal Muhsin. Pesantren ini lahir pada masa penjajahan Belanda dan tumbuh menjadi
            pusat pendidikan Islam yang memadukan pengajaran kitab kuning dengan sistem pendidikan modern, serta
            dikenal sebagai salah satu pesantren berpengaruh di Jawa Barat.
          </p>
          <ul className="faq-list faq-list-bottom">
            <li><strong>Pendiri:</strong> Didirikan oleh KH Zainal Muhsin, seorang tokoh ulama karismatik.</li>
            <li><strong>Tahun Berdiri:</strong> Berdiri pada tahun 1922 M bertepatan dengan 1341 H.</li>
            <li><strong>Latar Belakang:</strong> Awalnya berdiri sebagai pusat pengajaran agama Islam tradisional (Salafiyah).</li>
            <li><strong>Perkembangan:</strong> Di bawah generasi penerus, pesantren mengadopsi sistem pendidikan klasikal dan lembaga formal (MTs, MA).</li>
            <li><strong>Nama Resmi:</strong> Lembaga Pendidikan Pondok Pesantren Sukahideng / Perguruan K.H.Z. Musthafa Sukahideng.</li>
          </ul>
          <p>Pesantren ini terus konsisten menanamkan nilai-nilai keislaman, kebangsaan, disiplin, dan kemandirian.</p>
        </>
      );
    case "education":
      return (
        <>
          <p>
            Program pendidikan Pondok Pesantren Sukahideng di Tasikmalaya memadukan kajian kitab kuning tradisional
            dengan pendidikan formal (kurikulum nasional) serta asrama 24 jam.
          </p>
          <h4 className="faq-subtitle">Pendidikan Formal (Terpadu):</h4>
          <ul className="faq-list">
            <li>MTs KH. A. Wahab Muhsin</li>
            <li>SMK KH. A. Wahab Muhsin</li>
            <li>SMP KH. Zainal Musthafa</li>
            <li>SMA KH. Zainal Musthafa</li>
            <li>Bekerja sama dengan MTsN 1 Tasikmalaya dan MAN 1 Tasikmalaya.</li>
          </ul>
          <h4 className="faq-subtitle">Pendidikan Pesantren (Khas):</h4>
          <ul className="faq-list faq-list-bottom">
            <li>Kajian kitab kuning (tafaqquh fiddin).</li>
            <li>Pembiasaan shalat berjamaah, tahajjud, dan dhuha.</li>
            <li>Pengembangan bahasa Arab dan Inggris.</li>
            <li>Hafalan Al-Qur&apos;an / Juz Amma.</li>
          </ul>
        </>
      );
    case "facilities":
      return (
        <>
          <p>
            Pondok Pesantren Sukahideng menyediakan fasilitas pendidikan dan asrama yang lengkap untuk mendukung
            lingkungan belajar santri.
          </p>
          <h4 className="faq-subtitle">Fasilitas Pendidikan:</h4>
          <ul className="faq-list">
            <li>MTs KH. A. Wahab Muhsin</li>
            <li>SMK KH. A. Wahab Muhsin</li>
            <li>SMP KH. Zainal Musthafa</li>
            <li>SMA KH. Zainal Musthafa</li>
            <li>MTsN 1 Tasikmalaya (integrasi)</li>
            <li>MAN 1 Tasikmalaya (integrasi)</li>
          </ul>
          <h4 className="faq-subtitle">Fasilitas Ibadah & Pembelajaran:</h4>
          <ul className="faq-list">
            <li>Masjid / Musholla Utama untuk shalat berjamaah</li>
            <li>Ruang Kelas untuk kajian kitab kuning dan pembelajaran formal</li>
            <li>Area menghafal bersama di asrama</li>
          </ul>
          <h4 className="faq-subtitle">Fasilitas Asrama & Umum:</h4>
          <ul className="faq-list">
            <li>Kamar Asrama Santri</li>
            <li>Koperasi Pesantren</li>
            <li>Dapur Umum / Tempat Makan</li>
            <li>Kantor Pondok Pesantren</li>
            <li>Taman lingkungan Pesantren</li>
            <li>Sumber air bersih yang memadai</li>
          </ul>
          <h4 className="faq-subtitle">Layanan Tambahan:</h4>
          <ul className="faq-list faq-list-bottom">
            <li>Fasilitas Laundry</li>
            <li>Tours & Travel</li>
          </ul>
        </>
      );
    case "location":
      return (
        <>
          <p>
            Alamat Pondok Pesantren Sukahideng berada di Kp. Bageur, RT 16 RW 04, Desa Sukarapih, Kecamatan
            Sukarame, Kabupaten Tasikmalaya, Provinsi Jawa Barat 46461.
          </p>
          <h4 className="faq-subtitle">Informasi Kontak & Lokasi:</h4>
          <ul className="faq-list faq-list-bottom">
            <li><strong>Alamat Lengkap:</strong> Kp. Bageur RT 16 RW 04, Desa Sukarapih, Kec. Sukarame, Kab. Tasikmalaya, Jawa Barat.</li>
            <li><strong>Telepon:</strong> (0265) 545702</li>
            <li>
              <strong>Website:</strong>{" "}
              <a href="http://ponpes-sukahideng.or.id" target="_blank" rel="noopener noreferrer" className="faq-link">
                ponpes-sukahideng.or.id
              </a>
            </li>
            <li>
              <strong>Instagram:</strong>{" "}
              <a href="https://instagram.com/pp.sukahideng" target="_blank" rel="noopener noreferrer" className="faq-link">
                @pp.sukahideng
              </a>
            </li>
          </ul>
        </>
      );
  }
}

export default function InfoPesantren() {
  const items: AccordionItem[] = INFO_PONDOK_KEYS.map((key) => ({
    id: key,
    question: INFO_PONDOK_QUESTIONS[key],
    content: <InfoContent id={key} />,
  }));

  return (
    <section id="info" className="info-pesantren bg-light">
      <div className="container">
        <h2 className="section-title reveal">Info Pesantren</h2>
        <p className="section-subtitle reveal">
          Sekilas tentang Pondok Pesantren Sukahideng tempat gue nyantri.
        </p>
        <Reveal>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
