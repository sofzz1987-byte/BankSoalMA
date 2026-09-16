// ===== BANK SOAL =====
const bankSoal = {
  matematika: [
    { soal: "Hasil dari 12 x 8 adalah...", opsi: ["96", "88", "100", "104"], jawaban: 0 },
    { soal: "Akar dari 144 adalah...", opsi: ["10", "11", "12", "13"], jawaban: 2 },
    { soal: "Nilai x dari 2x + 5 = 15 adalah...", opsi: ["4", "5", "6", "7"], jawaban: 1 },
    { soal: "Luas lingkaran dengan jari-jari 7 (π=22/7) adalah...", opsi: ["154", "144", "164", "174"], jawaban: 0 },
    { soal: "Hasil dari 3² + 4² adalah...", opsi: ["25", "20", "49", "12"], jawaban: 0 }
  ],
  bahasa: [
    { soal: "Sinonim dari kata 'cerdas' adalah...", opsi: ["Bodoh", "Pintar", "Malas", "Rajin"], jawaban: 1 },
    { soal: "Kalimat tanya diakhiri dengan tanda...", opsi: ["Titik", "Koma", "Tanya", "Seru"], jawaban: 2 },
    { soal: "Antonim dari 'gelap' adalah...", opsi: ["Suram", "Terang", "Sunyi", "Ramai"], jawaban: 1 },
    { soal: "Paragraf yang berisi pendapat disebut...", opsi: ["Narasi", "Deskripsi", "Argumentasi", "Eksposisi"], jawaban: 2 },
    { soal: "Kata baku dari 'ijin' adalah...", opsi: ["Izin", "Ijin", "Ijim", "Iizin"], jawaban: 0 }
  ],
  agama: [
    { soal: "Rukun Islam yang pertama adalah...", opsi: ["Salat", "Syahadat", "Zakat", "Puasa"], jawaban: 1 },
    { soal: "Kitab suci umat Islam adalah...", opsi: ["Taurat", "Injil", "Zabur", "Al-Qur'an"], jawaban: 3 },
    { soal: "Nabi terakhir dalam Islam adalah...", opsi: ["Nabi Isa", "Nabi Musa", "Nabi Muhammad", "Nabi Ibrahim"], jawaban: 2 },
    { soal: "Puasa Ramadan hukumnya...", opsi: ["Sunnah", "Wajib", "Mubah", "Makruh"], jawaban: 1 },
    { soal: "Jumlah rakaat salat Subuh adalah...", opsi: ["2", "3", "4", "5"], jawaban: 0 }
  ]
};

// ===== STATE =====
let namaSiswa = "";
let mapelDipilih = "";
let soalAktif = [];
let jawabanUser = [];
let indexSoal = 0;
let waktuDetik = 0;
let timerInterval = null;

// ===== ELEMENT REFERENCES =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const inputNama = document.getElementById("nama-siswa");
const selectMapel = document.getElementById("pilih-mapel");
const btnMulai = document.getElementById("btn-mulai");

const infoNama = document.getElementById("info-nama");
const infoMapel = document.getElementById("info-mapel");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const soalTeks = document.getElementById("soal-teks");
const opsiContainer = document.getElementById("opsi-container");
const nomorSoalContainer = document.getElementById("nomor-soal");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnSelesai = document.getElementById("btn-selesai");

const resultNama = document.getElementById("result-nama");
const scoreCircle = document.getElementById("score-circle");
const resultDetail = document.getElementById("result-detail");
const btnReview = document.getElementById("btn-review");
const btnUlangi = document.getElementById("btn-ulangi");
const reviewContainer = document.getElementById("review-container");

// ===== MULAI UJIAN =====
btnMulai.addEventListener("click", () => {
  namaSiswa = inputNama.value.trim();
  mapelDipilih = selectMapel.value;

  if (!namaSiswa) {
    alert("Nama harus diisi!");
    return;
  }
  if (!mapelDipilih) {
    alert("Pilih mata pelajaran terlebih dahulu!");
    return;
  }

  soalAktif = bankSoal[mapelDipilih];
  jawabanUser = new Array(soalAktif.length).fill(null);
  indexSoal = 0;
  waktuDetik = 0;

  infoNama.textContent = "👤 " + namaSiswa;
  infoMapel.textContent = "📖 " + selectMapel.options[selectMapel.selectedIndex].text;

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  buatNomorSoal();
  tampilkanSoal();
  mulaiTimer();
});

// ===== TIMER =====
function mulaiTimer() {
  timerInterval = setInterval(() => {
    waktuDetik++;
    const menit = String(Math.floor(waktuDetik / 60)).padStart(2, "0");
    const detik = String(waktuDetik % 60).padStart(2, "0");
    timerEl.textContent = `⏱ ${menit}:${detik}`;
  }, 1000);
}

// ===== TAMPILKAN SOAL =====
function tampilkanSoal() {
  const soal = soalAktif[indexSoal];
  soalTeks.textContent = `${indexSoal + 1}. ${soal.soal}`;
  opsiContainer.innerHTML = "";

  soal.opsi.forEach((teksOpsi, i) => {
    const div = document.createElement("div");
    div.classList.add("opsi");
    div.textContent = `${String.fromCharCode(65 + i)}. ${teksOpsi}`;
    if (jawabanUser[indexSoal] === i) div.classList.add("dipilih");

    div.addEventListener("click", () => {
      jawabanUser[indexSoal] = i;
      tampilkanSoal();
      updateNomorSoal();
    });

    opsiContainer.appendChild(div);
  });

  progressText.textContent = `Soal ${indexSoal + 1} dari ${soalAktif.length}`;
  progressFill.style.width = `${((indexSoal + 1) / soalAktif.length) * 100}%`;

  btnPrev.disabled = indexSoal === 0;

  if (indexSoal === soalAktif.length - 1) {
    btnNext.classList.add("hidden");
    btnSelesai.classList.remove("hidden");
  } else {
    btnNext.classList.remove("hidden");
    btnSelesai.classList.add("hidden");
  }

  updateNomorSoal();
}

// ===== NOMOR SOAL NAVIGASI =====
function buatNomorSoal() {
  nomorSoalContainer.innerHTML = "";
  soalAktif.forEach((_, i) => {
    const span = document.createElement("span");
    span.textContent = i + 1;
    span.addEventListener("click", () => {
      indexSoal = i;
      tampilkanSoal();
    });
    nomorSoalContainer.appendChild(span);
  });
}

function updateNomorSoal() {
  const spans = nomorSoalContainer.querySelectorAll("span");
  spans.forEach((span, i) => {
    span.classList.remove("aktif", "terjawab");
    if (i === indexSoal) span.classList.add("aktif");
    else if (jawabanUser[i] !== null) span.classList.add("terjawab");
  });
}

// ===== NAVIGASI =====
btnPrev.addEventListener("click", () => {
  if (indexSoal > 0) {
    indexSoal--;
    tampilkanSoal();
  }
});

btnNext.addEventListener("click", () => {
  if (indexSoal < soalAktif.length - 1) {
    indexSoal++;
    tampilkanSoal();
  }
});

// ===== SELESAI UJIAN =====
btnSelesai.addEventListener("click", () => {
  const belumJawab = jawabanUser.filter(j => j === null).length;
  if (belumJawab > 0) {
    const lanjut = confirm(`Masih ada ${belumJawab} soal belum dijawab. Yakin ingin selesai?`);
    if (!lanjut) return;
  }
  selesaikanUjian();
});

function selesaikanUjian() {
  clearInterval(timerInterval);

  let benar = 0;
  soalAktif.forEach((soal, i) => {
    if (jawabanUser[i] === soal.jawaban) benar++;
  });

  const persen = Math.round((benar / soalAktif.length) * 100);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultNama.textContent = `Nama: ${namaSiswa}`;
  scoreCircle.textContent = `${persen}%`;
  scoreCircle.style.background = `conic-gradient(#43cea2 ${persen}%, #dde4ec ${persen}%)`;

  const menit = String(Math.floor(waktuDetik / 60)).padStart(2, "0");
  const detik = String(waktuDetik % 60).padStart(2, "0");

  resultDetail.textContent = `Benar: ${benar} dari ${soalAktif.length} soal | Waktu: ${menit}:${detik}`;

  buatReview();
}

// ===== REVIEW JAWABAN =====
function buatReview() {
  reviewContainer.innerHTML = "";
  reviewContainer.classList.add("hidden");

  soalAktif.forEach((soal, i) => {
    const userJawab = jawabanUser[i];
    const isBenar = userJawab === soal.jawaban;

    const div = document.createElement("div");
    div.classList.add("review-item", isBenar ? "benar" : "salah");

    div.innerHTML = `
      <strong>${i + 1}. ${soal.soal}</strong><br>
      Jawaban Anda: ${userJawab !== null ? soal.opsi[userJawab] : "(Tidak dijawab)"}<br>
      Jawaban Benar: ${soal.opsi[soal.jawaban]}
    `;

    reviewContainer.appendChild(div);
  });
}

btnReview.addEventListener("click", () => {
  reviewContainer.classList.toggle("hidden");
  btnReview.textContent = reviewContainer.classList.contains("hidden")
    ? "Lihat Pembahasan"
    : "Sembunyikan Pembahasan";
});

// ===== ULANGI UJIAN =====
btnUlangi.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  inputNama.value = "";
  selectMapel.value = "";
});