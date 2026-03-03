// ===== GLOBAL STATE =====
window.surahModules = window.surahModules || {};

let ayatData = [];
let currentIndex = 0;
let totalAttempts = 0;
let correctAttempts = 0;

const murottalPlayer = document.getElementById("murottalPlayer");
const surahSelect = document.getElementById("surahSelect");

// ===== DATABASE SURAT PER JUZ =====
const surahByJuz = {
    "Juz 29": [
        "al-mulk", "al-qalam", "al-haqqah", "al-ma'arij", 
        "nuh", "al-jinn", "al-muzzammil", "al-muddatsstsir", 
        "al-qiyamah", "al-insan", "al-mursalat"
    ],
    "Juz 30": [
        "an-naba", "an-nazi’at", "abasa", "at-takwir", "al-infitar", 
        "al-muthaffifin", "al-inshiqaq", "al-buruj", "ath-thariq", 
        "al-a’la", "al-ghasyiyah", "al-fajr", "al-balad", "ash-shams", 
        "al-lail", "adh-dhuha", "al-insyirah", "at-tin", "al-alaq", 
        "al-qadr", "al-bayyinah", "az-zalzalah", "al-adiyat", "al-qari’ah", 
        "at-takatsur", "al-asr", "al-humazah", "al-fil", "al-quraish", 
        "al-ma’un", "al-kautsar", "al-kafirun", "an-nasr", "al-lahab", 
        "al-ikhlas", "al-falaq", "an-nas"
    ],
    "Lainnya": [
        "al-fatihah", "ayat-kursi"
    ]
};

// ===== RENDER KATALOG =====
function renderSurahCatalog() {
    const container = document.getElementById('surahCatalog');
    if (!container) return;
    container.innerHTML = '';

    for (const [juzName, surahList] of Object.entries(surahByJuz)) {
        
        // Wrapper untuk satu kelompok Juz
        const juzWrapper = document.createElement('div');
        juzWrapper.className = "mb-2";

        // Tombol Header Juz (Bisa diklik)
        const header = document.createElement('button');
        header.className = "w-full flex justify-between items-center bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl border border-slate-100 shadow-sm transition-all";
        header.innerHTML = `
            <span>${juzName}</span>
            <span class="icon-arrow transition-transform duration-300">▼</span>
        `;

        // Container untuk daftar surat (Hidden secara default)
        const listContainer = document.createElement('div');
        listContainer.className = "hidden space-y-2 mt-2 px-2 overflow-hidden transition-all";

        // Logika Klik untuk Buka/Tutup
        header.onclick = () => {
            const isHidden = listContainer.classList.contains('hidden');
            
            // Tutup semua juz lain dulu supaya rapi (Opsional, hapus loop ini kalau mau bisa buka banyak sekaligus)
            document.querySelectorAll('.juz-list').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.icon-arrow').forEach(el => el.style.transform = 'rotate(0deg)');

            if (isHidden) {
                listContainer.classList.remove('hidden');
                header.querySelector('.icon-arrow').style.transform = 'rotate(180deg)';
            }
        };

        // Tambahkan class penanda untuk fungsi tutup otomatis
        listContainer.classList.add('juz-list');

        // Isi surat-suratnya
        surahList.forEach(name => {
            const isAvailable = !!(window.surahModules && window.surahModules[name]);
            const card = document.createElement('div');
            card.className = isAvailable
                ? 'group flex items-center justify-between p-3 bg-white border border-slate-50 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer'
                : 'flex items-center justify-between p-3 bg-slate-50 rounded-xl opacity-50 grayscale cursor-not-allowed';

            const displayName = name.replace(/-/g, ' ').toUpperCase();
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-sm">${isAvailable ? '📖' : '🔒'}</span>
                    <div class="font-bold text-slate-600 text-[13px]">${displayName}</div>
                </div>
            `;

            if (isAvailable) {
                card.onclick = (e) => {
                    e.stopPropagation(); // Biar nggak trigger click header juz
                    surahSelect.innerHTML = `<option value="${name}">${name}</option>`;
                    surahSelect.value = name;
                    loadSurah();
                };
            }
            listContainer.appendChild(card);
        });

        juzWrapper.appendChild(header);
        juzWrapper.appendChild(listContainer);
        container.appendChild(juzWrapper);
    }
}

// Jalankan render saat script dimuat
renderSurahCatalog();

// ===== FUNGSI UI TOGGLE =====
function showCatalog() {
    document.getElementById('catalogContainer').classList.remove('hidden');
    document.getElementById('controlCard').classList.add('hidden');
    document.getElementById('showCatalogBtn').classList.add('hidden');
    document.getElementById('currentAyat').classList.add('hidden');
    document.getElementById('statusPlaceholder').classList.remove('hidden');
    document.getElementById("status").innerText = "Silakan pilih surat di samping untuk memulai hafalan";
    document.getElementById("ayatList").innerHTML = "";
}

// ===== LOGIKA INTI SURAH =====
function loadSurah() {
    const selected = surahSelect.value;

    if (!window.surahModules[selected]) {
        alert("Data surat belum dimuat.");
        return;
    }

    ayatData = window.surahModules[selected].ayat;
    currentIndex = 0;
    totalAttempts = 0;
    correctAttempts = 0;

    // Reset UI State
    document.getElementById("accuracy").innerText = "0%";
    document.getElementById("status").innerHTML = `Latihan: <b>${window.surahModules[selected].name}</b>`;
    
    // Switch Views
    document.getElementById('catalogContainer').classList.add('hidden');
    document.getElementById('controlCard').classList.remove('hidden');
    document.getElementById('showCatalogBtn').classList.remove('hidden');
    document.getElementById('currentAyat').classList.remove('hidden');
    document.getElementById('statusPlaceholder').classList.add('hidden');

    renderCurrentAyat();
    renderAyatList();
}

function renderCurrentAyat() {
    if (!ayatData || ayatData.length === 0) return;
    const idx = Math.min(currentIndex, ayatData.length - 1);
    const a = ayatData[idx];

    document.getElementById('currentArab').innerText = a.text;
    document.getElementById('currentLatin').innerText = a.trigger;
    document.getElementById('expectedText').innerText = normalize(a.trigger);
    document.getElementById('spokenText').innerText = "...";
}

function renderAyatList() {
    const container = document.getElementById("ayatList");
    container.innerHTML = "";
    if (!ayatData || ayatData.length === 0) return;

    // Tampilkan ayat yang sudah dibuka/dilewati
    for (let i = 0; i <= Math.min(currentIndex, ayatData.length - 1); i++) {
        const a = ayatData[i];
        const isActive = i === currentIndex;

        const card = document.createElement("div");
        card.className = `p-5 rounded-2xl border flex items-center justify-between transition-all fade-in ${
            isActive 
            ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20 scale-[1.02]' 
            : 'bg-white border-slate-100 opacity-80 shadow-sm'
        }`;

        card.innerHTML = `
            <div>
                <div class="text-right font-arabic text-2xl mb-2 ${isActive ? 'text-emerald-700' : 'text-slate-600'}" dir="rtl">${a.text}</div>
                <div class="text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-slate-400'}">
                    ${isActive ? '🔊 Sedang Dibaca' : '✅ Selesai'}
                </div>
            </div>
            <button onclick="playSpecificAudio(${i})" class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                ▶
            </button>
        `;
        container.appendChild(card);
    }
}

function playSpecificAudio(idx) {
    if (ayatData[idx] && ayatData[idx].audio) {
        murottalPlayer.src = ayatData[idx].audio;
        murottalPlayer.play();
    }
}

function playExpectedAudio() {
    playSpecificAudio(Math.min(currentIndex, ayatData.length - 1));
}

// ===== SPEECH RECOGNITION =====
function normalize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
            else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
    }
    return matrix[b.length][a.length];
}

function similarity(a, b) {
    if (a.length === 0 || b.length === 0) return 0;
    const distance = levenshtein(a, b);
    return 1 - distance / Math.max(a.length, b.length);
}

function updateAccuracy() {
    const percent = totalAttempts === 0 ? 0 : Math.floor((correctAttempts / totalAttempts) * 100);
    document.getElementById("accuracy").innerText = percent + "%";
}

function startListening() {
    if (currentIndex >= ayatData.length) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser tidak mendukung Speech Recognition.");

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.start();

    document.getElementById("status").innerText = "🎧 Mendengarkan...";

    recognition.onresult = function(event) {
        totalAttempts++;
        const transcript = normalize(event.results[0][0].transcript);
        const expected = normalize(ayatData[currentIndex].trigger);

        document.getElementById("spokenText").innerText = transcript;
        const simScore = similarity(transcript, expected);

        if (simScore > 0.70) {
            correctAttempts++;
            document.getElementById("status").innerHTML = "<span class='text-emerald-600 font-bold'>✅ Bagus! Lanjut...</span>";
            
            // Putar audio otomatis sebagai feedback
            playSpecificAudio(currentIndex);
            
            currentIndex++;
            setTimeout(() => {
                if (currentIndex < ayatData.length) {
                    renderCurrentAyat();
                    renderAyatList();
                } else {
                    document.getElementById("status").innerText = "🎉 MasyaAllah, Selesai!";
                    renderAyatList();
                }
            }, 1500);
        } else {
            document.getElementById("status").innerHTML = "<span class='text-red-500 font-bold'>❌ Coba ulangi lagi...</span>";
        }
        updateAccuracy();
    };

    recognition.onerror = () => {
        document.getElementById("status").innerText = "❌ Gagal mendengar, coba lagi.";
    };
}