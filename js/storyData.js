/**
 * Story Data for "A Little Story About Us"
 * Visual Novel Narrative Script & Metadata
 */

export const STORY_META = {
  title: "A Little Story About Us",
  tagline: "Some stories are worth telling.",
  authorLabel: "A Little Story",
  subLabel: "A story made just for you.",
  readSlowHint: "Baca pelan-pelan, ya.",
  totalChapters: 7,
};

export const STORY_SLIDES = [
  {
    id: 1,
    chapter: "01",
    label: "Bagian I",
    title: "Awal Pertemuan",
    text: "Aku nggak pernah berpikir kalau bertemu seseorang bisa mengubah cara pandangku terhadap banyak hal.",
    mood: "reflective"
  },
  {
    id: 2,
    chapter: "02",
    label: "Bagian II",
    title: "Perubahan Rasa",
    text: "Awalnya, kupikir hadirnya kamu cuma bagian kecil dari rutinitas yang nantinya akan berlalu begitu saja.\n\nTapi ternyata, semakin ke sini aku mulai sadar kalau ada beberapa hal yang nggak ingin kulewatkan… dan salah satunya adalah kesempatan untuk mengenal kamu lebih jauh.",
    mood: "discovery"
  },
  {
    id: 3,
    chapter: "03",
    label: "Bagian III",
    title: "Ketulusan",
    text: "Mungkin apa yang akan aku bilang ini nggak cukup untuk mengganti semua ketenangan yang mungkin sudah aku ganggu dalam hidupmu.\n\nTapi kalau kamu memberiku kesempatan, aku ingin memberikan semuanya, waktu, perhatian, dan kesempatan untuk membuat lebih banyak cerita bersama.",
    mood: "devotion"
  },
  {
    id: 4,
    chapter: "04",
    label: "Bagian IV",
    title: "Pengertian",
    text: "Kalau ternyata semua ini terasa mengganggu buatmu, nggak apa-apa.\n\nKamu boleh menganggapnya tidak pernah ada dan melupakannya.",
    mood: "calm"
  },
  {
    id: 5,
    chapter: "05",
    label: "Bagian V",
    title: "Keberanian",
    text: "Tapi setidaknya kali ini, aku ingin jujur tanpa harus menunggu jawaban darimu.",
    mood: "courage"
  },
  {
    id: 6,
    chapter: "06",
    label: "Bagian VI",
    title: "Tanpa Penyesalan",
    text: "Aku tetap ingin melakukannya, terlepas dari apa pun jawabanmu.\n\nKarena aku nggak ingin suatu hari nanti bertanya-tanya, “bagaimana kalau waktu itu aku mengatakannya?”",
    mood: "resolve"
  },
  {
    id: 7,
    chapter: "07",
    label: "Bagian VII",
    title: "Sebuah Harapan",
    text: "Jadi… kalau kamu nggak keberatan, bisakah kita membuat lebih banyak kenangan bersama, mulai dari sekarang?",
    mood: "anticipation"
  }
];

export const CONFESSION_DATA = {
  quote: "Jadi… kalau kamu nggak keberatan, bisakah kita membuat lebih banyak kenangan bersama, mulai dari sekarang?",
  question: "Would you like to create more memories with me?",
  choices: [
    {
      id: "accept",
      text: "Iya, tentu.",
      subtitle: "Mari buat cerita bersama",
      type: "primary"
    },
    {
      id: "decline",
      text: "Maaf, aku belum bisa.",
      subtitle: "Terima kasih atas kejujuranmu",
      type: "secondary"
    }
  ]
};

export const RESPONSE_DATA = {
  accept: {
    status: "accepted",
    badge: "A New Chapter Begins",
    title: "Langkah Baru Kita",
    message: "Terima kasih sudah memberiku kesempatan. Semoga ini menjadi awal dari lebih banyak cerita indah yang bisa kita buat bersama.",
    actionText: "Baca Cerita Lagi",
    theme: "golden"
  },
  decline: {
    status: "declined",
    badge: "With Utmost Respect",
    title: "Terima Kasih Banyak",
    message: "Nggak apa-apa, terima kasih sudah membaca dan meluangkan waktumu. Aku tetap menghargai apa pun jawabanmu. Semoga kamu selalu bahagia.",
    actionText: "Kembali ke Cerita",
    theme: "ocean"
  }
};
