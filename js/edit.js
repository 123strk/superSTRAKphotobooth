const $ = (id) => document.getElementById(id);
const strip = $("strip"),
  cap = $("cap"),
  photosDiv = $("photos"),
  head = $("head"),
  foot = $("foot");
const fit = $("fit"),
  wrap = $("fitWrap");

// kalau stiker gagal dimuat, tombol lain tetap jalan
const STK = typeof SK !== "undefined" ? SK : {};
const STK_ORDER = typeof SK_ORDER !== "undefined" ? SK_ORDER : [];

const photos = JSON.parse(localStorage.getItem("photoStrip") || "[]");
const today = new Date().toLocaleDateString("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

// iPhone / iPad (termasuk iPad yang menyamar sebagai Mac)
const isIOS =
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// ikon voice call + video call untuk header chat (dipasang sebagai gambar saat diunduh)
const CHAT_ICON =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="92" height="36" viewBox="0 0 50 24" fill="none" stroke="#2f8cf0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<g transform="translate(-1 1) scale(.9)"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></g>' +
      '<g transform="translate(27 0)"><rect x="0" y="5" width="15" height="14" rx="2"/><path d="M22 7l-6 4.5 6 4.5z"/></g></svg>',
  );

// n = nama tombol, h = judul, f = teks bawah, s = id stiker dekorasi (urutan sudut: kiri-atas, kanan-atas, kiri-bawah, kanan-bawah)
const THEMES = {
  elegan: { n: "Elegan", h: "superSTRAK", f: today, s: ["sparkle", "star", "sparkle", "star"] },
  hero: { n: "Hero Web", h: "HERO", f: "IT STARTS HERE", s: ["web", "burst", "mask", "bolt"] },
  multi: { n: "Multiverse", h: "MULTIVERSE", f: "EVERY MOMENT MATTERS", s: ["burst", "bolt", "sparkle", "star"] },
  armor: { n: "Armor Gold", h: "ARMOR UP", f: today, s: ["arc", "bolt", "star", "arc"] },
  comic: { n: "Komik hero", h: "POW!", f: "ISSUE #1 • " + today, s: ["burst", "bolt", "star", "burst"] },
  manga: { n: "Manga", h: "BAM!", f: "CHAPTER 1 • " + today, s: ["burst", "sparkle", "bolt", "star"] },
  popart: { n: "Pop art", h: "WOW!", f: today, s: ["burst", "star", "heart", "bolt"] },
  girly: { n: "Girly", h: "cutie ♡", f: today, s: ["bow", "flower", "heart", "sparkle"] },
  cat: { n: "Kucing", h: "meow ♡", f: "purr-fect • " + today, s: ["cat", "paw", "heart", "star"] },
  chatb: { n: "Chat Biru", h: "superSTRAK", f: "message", s: [] },
  chatg: { n: "Chat Abu", h: "superSTRAK", f: "message", s: [] },
  blob: { n: "Blob", h: "Captured", f: "in a soft moment • " + today, s: ["sparkle", "heart", "sparkle", "bow"] },
  checker: { n: "Checker", h: "good vibes", f: today, s: ["smile", "flower", "smile", "sparkle"] },
  denim: { n: "Denim", h: "denim days", f: today, s: ["star", "flower", "heart", "star"] },
  tiket: { n: "Tiket", h: "BOARDING PASS", f: "JKT → TYO • " + today, s: ["plane", "sparkle", "plane", "star"] },
  perangko: { n: "Perangko", h: "Series 1.0", f: "Happy Anniversary! • " + today, s: ["heart", "sparkle", "heart", "sparkle"] },
  retro: { n: "Retro", h: "untitled - superSTRAK", f: "For Help, press F1 • " + today, s: [] },
  rosso: { n: "F1 Rosso", h: "ROSSO CORSA", f: "RACE DAY • " + today, s: ["f1red", "flag", "trophy", "f1red"] },
  silver: { n: "F1 Silver", h: "SILVER ARROW", f: "GRID 01 • " + today, s: ["f1silver", "flag", "trophy", "f1silver"] },
  kart: { n: "Go-Kart", h: "GO-KART", f: "LAP 01 • " + today, s: ["kart", "flag", "trophy", "kart"] },
  film: { n: "Film 35mm", h: "35MM", f: "FRAME 12A • " + today, s: [] },
  vintage: { n: "Vintage", h: "Memories", f: today, s: ["flower", "sparkle", "rose", "sparkle"] },
};
// posisi stiker dekorasi: empat sudut, SELALU di dalam bingkai (px dari tepi)
const SPOTS = [
  { l: 4, t: 4 },
  { r: 4, t: 4 },
  { l: 4, b: 4 },
  { r: 4, b: 4 },
];
const COLORS = [
  "#0f2547", "#1f4fd8", "#dce8fb", "#e0243a", "#111111", "#ffffff",
  "#ffd1e3", "#e8d5ff", "#ffd93b", "#c8f7c5", "#ffcba4", "#a8c5b5",
];

let theme = "elegan",
  sel = null,
  scale = 1;

/* ---------- muat strip ke satu layar ---------- */
function fitStrip() {
  fit.style.width = fit.style.height = "";
  cap.style.transform = "none";
  const w = cap.offsetWidth,
    h = cap.offsetHeight;
  const ch = wrap.clientHeight || h,
    cw = wrap.clientWidth || w;
  scale = Math.min(1, ch / h, cw / w);
  if (!(scale > 0)) scale = 1;
  cap.style.transform = `scale(${scale})`;
  fit.style.width = w * scale + "px";
  fit.style.height = h * scale + "px";
}

/* ---------- foto & tema ---------- */
function renderPhotos() {
  photosDiv.innerHTML = "";
  if (!photos.length) {
    photosDiv.innerHTML =
      '<p class="empty">Belum ada foto. Kembali dan ambil foto dulu.</p>';
    return;
  }
  photos.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    photosDiv.appendChild(img);
  });
}

function renderDecor() {
  strip.querySelectorAll(".stk").forEach((s) => s.remove());
  THEMES[theme].s.forEach((id, i) => {
    if (!STK[id] || !SPOTS[i]) return;
    const s = document.createElement("img");
    s.className = "stk";
    s.src = STK[id].src;
    s.alt = "";
    const p = SPOTS[i];
    if (p.l !== undefined) s.style.left = p.l + "px";
    if (p.r !== undefined) s.style.right = p.r + "px";
    if (p.t !== undefined) s.style.top = p.t + "px";
    if (p.b !== undefined) s.style.bottom = p.b + "px";
    s.style.transform = `rotate(${i % 2 ? 10 : -10}deg)`;
    strip.appendChild(s);
  });
}

function setTheme(name) {
  theme = name;
  strip.dataset.theme = name;
  strip.style.removeProperty("--bg");
  strip.style.backgroundImage = "";
  strip.style.color = "";
  head.textContent = THEMES[name].h;
  foot.textContent = THEMES[name].f;
  document
    .querySelectorAll("[data-theme].chip")
    .forEach((b) => b.classList.toggle("active", b.dataset.theme === name));
  document
    .querySelectorAll(".swatch")
    .forEach((s) => s.classList.remove("active"));
  renderDecor();
  fitStrip();
}

function setCols(n) {
  strip.classList.toggle("cols-2", n === 2);
  document
    .querySelectorAll("[data-cols]")
    .forEach((b) => b.classList.toggle("active", +b.dataset.cols === n));
  fitStrip();
}

function select(s) {
  if (sel) sel.classList.remove("sel");
  sel = s;
  if (s) s.classList.add("sel");
}

/* ---------- tombol tema & tombol utama (dipasang paling awal) ---------- */
Object.keys(THEMES).forEach((key) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.dataset.theme = key;
  b.textContent = THEMES[key].n;
  b.addEventListener("click", () => setTheme(key));
  $("themeGrid").appendChild(b);
});
document
  .querySelectorAll("[data-cols]")
  .forEach((b) => b.addEventListener("click", () => setCols(+b.dataset.cols)));
$("backBtn").addEventListener("click", () => {
  location.href = "index.html";
});

/* ---------- UNDUH: Android/Windows langsung unduh, iOS lewat jendela simpan ---------- */
(function () {
  const css = document.createElement("style");
  css.textContent =
    ".sheet{position:fixed;inset:0;z-index:999;background:rgba(10,27,51,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;overflow:auto}" +
    // flex:none + width/height auto = proporsi asli, tidak bisa gepeng
    ".sheet img{flex:none;display:block;width:auto;height:auto;max-width:100%;max-height:66vh;border-radius:6px;background:#fff;-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto}" +
    ".sheet p{color:#dce8fb;font-size:13px;text-align:center;max-width:34ch;line-height:1.55}" +
    ".sheet .acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}";
  document.head.appendChild(css);
})();

function canvasToBlob(canvas) {
  return new Promise((res) => canvas.toBlob(res, "image/png"));
}

function showSaveSheet(blob, filename) {
  const url = URL.createObjectURL(blob);
  const file = new File([blob], filename, { type: "image/png" });
  const box = document.createElement("div");
  box.className = "sheet";
  box.innerHTML =
    '<img alt="Hasil strip">' +
    "<p>Tekan <b>Simpan / Bagikan</b>, lalu pilih <b>Simpan Gambar</b>. " +
    "Atau tekan lama gambar di atas dan pilih <b>Simpan ke Foto</b>.</p>" +
    '<div class="acts"><button class="btn rec" id="shareBtn">Simpan / Bagikan</button>' +
    '<button class="btn ghost" id="closeSheet">Tutup</button></div>';
  box.querySelector("img").src = url;
  document.body.appendChild(box);

  const close = () => {
    box.remove();
    URL.revokeObjectURL(url);
  };
  box.querySelector("#closeSheet").addEventListener("click", close);
  box.querySelector("#shareBtn").addEventListener("click", async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "superSTRAK" });
      } else {
        alert("Tekan lama gambar lalu pilih Simpan ke Foto.");
      }
    } catch (e) {
      /* dibatalkan pengguna, abaikan */
    }
  });
}

$("downloadBtn").addEventListener("click", async () => {
  select(null); // hilangkan garis putus-putus
  const btn = $("downloadBtn"),
    label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Menyiapkan...";

  // ukuran piksel asli tiap foto di layar (tidak terpengaruh scale preview)
  const sizes = [...photosDiv.querySelectorAll("img")].map((im) => [
    im.offsetWidth,
    im.offsetHeight,
  ]);

  try {
    const canvas = await html2canvas(cap, {
      scale: isIOS ? 2 : 3, // iPhone lama terbatas memori
      useCORS: true,
      backgroundColor: null,
      logging: false,
      // render salinan seolah di layar lebar, supaya tata letak versi HP tidak ikut
      windowWidth: 1400,
      windowHeight: 900,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => {
        doc.body.classList.remove("edit-page");
        doc.getElementById("cap").style.transform = "none";
        const f = doc.getElementById("fit");
        f.style.width = f.style.height = "";

        // kunci ukuran tiap foto supaya tidak bergantung pada aspect-ratio
        doc.querySelectorAll("#photos img").forEach((im, i) => {
          if (!sizes[i]) return;
          im.style.width = sizes[i][0] + "px";
          im.style.height = sizes[i][1] + "px";
          im.style.aspectRatio = "auto";
          im.style.objectFit = "cover";
        });

        // header chat: ikon call dipasang sebagai gambar biasa supaya pasti ikut tersimpan
        if (theme.startsWith("chat")) {
          const h = doc.getElementById("head");
          h.classList.add("real-ico");
          const im = doc.createElement("img");
          im.src = CHAT_ICON;
          im.width = 46;
          im.height = 18;
          im.style.cssText = "display:block;flex:none;width:46px;height:18px";
          h.appendChild(im);
        }
      },
    });

    const blob = await canvasToBlob(canvas);
    if (!blob) throw new Error("Gagal membuat gambar");
    const name = "superSTRAK-" + theme + ".png";

    if (isIOS) {
      showSaveSheet(blob, name);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
  } catch (err) {
    console.error(err);
    alert("Gagal membuat gambar. Coba lagi, atau kurangi jumlah stiker.");
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});

head.addEventListener("input", fitStrip);
foot.addEventListener("input", fitStrip);
window.addEventListener("resize", fitStrip);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStrip);

renderPhotos();
setTheme("elegan");

/* ---------- warna custom ---------- */
COLORS.forEach((c) => {
  const d = document.createElement("button");
  d.className = "swatch";
  d.style.background = c;
  d.setAttribute("aria-label", "Warna " + c);
  d.addEventListener("click", () => {
    strip.style.setProperty("--bg", c);
    strip.style.backgroundImage = "none";
    const lum =
      parseInt(c.slice(1, 3), 16) * 0.3 +
      parseInt(c.slice(3, 5), 16) * 0.6 +
      parseInt(c.slice(5, 7), 16) * 0.1;
    strip.style.color = lum < 140 ? "#fff" : "#111";
    document
      .querySelectorAll(".swatch")
      .forEach((s) => s.classList.remove("active"));
    d.classList.add("active");
  });
  $("swatches").appendChild(d);
});

/* ---------- stiker bebas (geser ke wajah) ---------- */
function paint(s) {
  s.style.width = s.style.height = s.dataset.size + "px";
  s.style.transform = `rotate(${s.dataset.rot}deg)`;
}

function addSticker(id) {
  const s = document.createElement("img");
  s.className = "ustk";
  s.src = STK[id].src;
  s.alt = STK[id].n;
  s.draggable = false;
  s.addEventListener("dragstart", (e) => e.preventDefault());
  s.dataset.size = 64;
  s.dataset.rot = 0;
  paint(s);
  s.style.left = strip.clientWidth / 2 - 32 + "px";
  s.style.top = strip.clientHeight / 3 + "px";

  s.addEventListener("pointerdown", (ev) => {
    select(s);
    const sx = ev.clientX,
      sy = ev.clientY,
      ox = s.offsetLeft,
      oy = s.offsetTop;
    s.setPointerCapture(ev.pointerId);
    const move = (m) => {
      // dibagi scale supaya gerakan pas walau strip sedang diperkecil
      s.style.left = ox + (m.clientX - sx) / scale + "px";
      s.style.top = oy + (m.clientY - sy) / scale + "px";
    };
    const up = () => {
      s.removeEventListener("pointermove", move);
      s.removeEventListener("pointerup", up);
    };
    s.addEventListener("pointermove", move);
    s.addEventListener("pointerup", up);
  });

  strip.appendChild(s);
  select(s);
}

try {
  STK_ORDER.forEach((id) => {
    if (!STK[id]) return;
    const b = document.createElement("button");
    b.title = STK[id].n;
    b.setAttribute("aria-label", STK[id].n);
    const im = document.createElement("img");
    im.src = STK[id].src;
    im.alt = "";
    b.appendChild(im);
    b.addEventListener("click", () => addSticker(id));
    $("stkGrid").appendChild(b);
  });
  if (!STK_ORDER.length)
    $("stkGrid").innerHTML =
      '<p class="hint">Stiker belum termuat. Cek file js/stickers.js.</p>';
} catch (err) {
  console.error("Panel stiker gagal:", err);
}

const tool = (fn) => () => {
  if (sel) {
    fn(sel);
    paint(sel);
  }
};
$("tBig").addEventListener(
  "click",
  tool((s) => (s.dataset.size = Math.min(180, +s.dataset.size + 8))),
);
$("tSmall").addEventListener(
  "click",
  tool((s) => (s.dataset.size = Math.max(24, +s.dataset.size - 8))),
);
$("tRot").addEventListener(
  "click",
  tool((s) => (s.dataset.rot = (+s.dataset.rot + 15) % 360)),
);
$("tDel").addEventListener("click", () => {
  if (sel) {
    sel.remove();
    sel = null;
  }
});
