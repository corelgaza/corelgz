export const NAV_LINKS = [
  { href: "#home", label: "Beranda" },
  { href: "#tentang", label: "About Me" },
  { href: "#jadwal-shalat", label: "Jadwal Shalat" },
  { href: "#kegiatan", label: "Kegiatan" },
  { href: "#info", label: "Info Pondok" },
  { href: "#galeri", label: "Galeri" },
  { href: "#kontak", label: "Kontak" },
] as const;

export const BIODATA = [
  { label: "Nama Lengkap", value: "Corel Rambu Gaza Wiwoho" },
  { label: "Nama Panggilan", value: "Corel" },
  { label: "Tempat, Tgl Lahir", value: "Pati, 15 Juni 2010" },
  { label: "Hobi", value: "Badminton" },
  { label: "Cita-cita", value: "Businessman" },
] as const;

export const QUOTE = {
  text: "Pentingnya ilmu yang bermanfaat bagi dunia-akhirat serta menjaga silaturahmi yang erat antara alumni dan pesantren.",
  cite: "— Drs. KH. Ii Abdul Basith Wahab",
};

export const TIMELINE = [
  {
    time: "03:30 - 06:00",
    title: "Shalat Subuh dan Ngaji 🕌📖",
    description:
      "Bangun pagi buta buat siap-siap shalat subuh berjamaah. Habis wiridan, lanjut ke sesi yang jujur paling bikin ngantuk: ngaji subuh! Tapi ya harus tetep semangat buat ngejar berkah.",
  },
  {
    time: "06:00 - 06:30",
    title: "Persiapan Sekolah 🚿👕",
    description:
      "Beres ngaji subuh, waktunya balik ke asrama buat mandi, rapi-rapi, nyetrika seragam, dan nyiapin mental buat berangkat sekolah.",
  },
  {
    time: "06:30 - 12:30",
    title: "Mode Anak Sekolah On! 🎒📚",
    description:
      "Full kegiatan belajar ngikutin kurikulum sekolah. Shalat Dzuhur dan istirahat siang juga dilakuin bareng temen-temen di area sekolah.",
  },
  {
    time: "12:30 - 17:00",
    title: "Persiapan Shalat Ashar dan Ngaji 🌅📖",
    description:
      "Pulang sekolah rebahan bentar (kalo sempet), terus langsung siap-siap buat jamaah shalat Ashar. Habis itu gas ngaji sore lagi bareng ustaz.",
  },
  {
    time: "18:10 - 21:30",
    title: "Maghrib, Isya', & Ngaji 🌙🕋",
    description:
      "Jadwal non-stop! Habis jamaah Maghrib langsung nyambung ngaji bareng, terus ditutup dengan shalat Isya berjamaah.",
  },
  {
    time: "22:00 - 22:30",
    title: "Menghafal Al-Qur'an dan Pengajian Malam 🧠✨",
    description:
      "Waktunya kumpul di kobong (kamar) bareng temen-temen buat setor hafalan dan ngaji Al-Qur'an. Vibesnya berisik, seru, tapi tetep asik.",
  },
  {
    time: "23:00 - 03:30",
    title: "Molor Time! 😴🛌",
    description:
      "Akhirnya bisa rebahan dan tidur juga! Istirahat total abis seharian digempur jadwal padet merayap (apa lagi ngajinya hahaha).",
    italicCharge: true as const,
  },
] as const;

export const INFO_PONDOK_KEYS = [
  "history",
  "education",
  "facilities",
  "location",
] as const;

export const INFO_PONDOK_QUESTIONS: Record<(typeof INFO_PONDOK_KEYS)[number], string> = {
  history: "🏛️ Sejarah Pondok Pesantren Sukahideng",
  education: "📚 Program Pendidikan",
  facilities: "🕌 Fasilitas Lengkap",
  location: "📍 Lokasi Pesantren",
};

/** Fallback galeri jika Supabase belum dikonfigurasi */
export const GALLERY_FALLBACK = [
  { src: "/images/pondok1.webp", alt: "Serunya ngaji bareng temen-temen", caption: "Serunya ngaji bareng temen-temen 📖✨" },
  { src: "/images/pondok2.jpeg", alt: "Penampakan asrama", caption: "Penampakan asrama gue nih, hehe 🏠😎" },
  { src: "/images/pondok5.webp", alt: "Penampakan asrama lain", caption: "Penampakan asrama lain 🏰✨" },
  { src: "/images/pondok4.jpeg", alt: "Ngaji bareng di aula", caption: "Vibes santriwati ngaji bareng di aula" },
  { src: "/images/gedung.jpg", alt: "Halaman asrama yang luas", caption: "Vibes halaman asrama pas lagi sepi, adem banget 🕌✨" },
  { src: "/images/logo.png", alt: "Logo Pondok Pesantren Sukahideng", caption: "Logo kebanggaan kita! 💚💛" },
] as const;

export const TESTIMONIALS = [
  {
    text: "Kamu orangnya baik bro. Kalau aku lagi nggak punya uang atau apa-apa lu suka minjemin, kadang-kadang lu suka bilang 'bawa weh'. Terus kalau lagi sedih lu suka ngehibur. Banyak kenangan indah bro!",
    author: "iicun",
    instagram: "https://instagram.com/ihs_an_nlfkri",
    handle: "@ihs_an_nlfkri",
  },
  {
    text: "Kalau aku lagi butuh ke kamu, kamu selalu ada. Pas lagi nggak ada kerjaan di sekolah juga kamu suka ngehibur sambil berpetualang. Pokoknya kamu itu kemana-mana selalu effort!",
    author: "Fajar",
    instagram: "https://instagram.com/f_jarr.11",
    handle: "@f_jarr.11",
  },
] as const;

export const FAQ_PONDOK = [
  {
    question: "Boleh bawa HP nggak di pondok?",
    answer:
      "Enggak boleh, ya. Di pondok peraturannya sangat ketat soal larangan membawa HP. Tapi serunya, tanpa HP kita jadi lebih fokus belajar dan makin akrab karena sering ngobrol bareng teman-teman.",
  },
  {
    question: "Makannya gimana? Enak nggak?",
    answer:
      "Soal makan sudah disediakan oleh ibu-ibu dapur yang memasak dan mengantarkan makanan untuk para santri. Lauknya memang sederhana, tapi kalau sudah makan bareng teman-teman, rasanya bener-bener nikmat pol!",
  },
  {
    question: "Sering kangen rumah nggak?",
    answer:
      "Awal-awal pasti ada rasa kangen rumah. Tapi karena jadwal mengajinya padat dan banyak teman yang seru, kita jadi terbiasa dan malah betah. Apalagi kalau sudah kumpul bareng teman seangkatan, momennya pasti susah dilupakan deh!",
  },
] as const;
