/* ---------- kotak error (kalau ada masalah, tampil di layar HP) ---------- */
function showErr(msg) {
  let b = document.getElementById("errBox");
  if (!b) {
    b = document.createElement("div");
    b.id = "errBox";
    b.style.cssText =
      "position:fixed;left:8px;right:8px;bottom:8px;z-index:1000;background:#b91c2f;color:#fff;font:12px/1.4 sans-serif;padding:8px 10px;border-radius:8px;max-height:30vh;overflow:auto";
    document.body.appendChild(b);
  }
  b.textContent = "Error: " + msg;
}
window.addEventListener("error", (e) =>
  showErr(
    e.message +
      " (" +
      (e.filename || "").split("/").pop() +
      ":" +
      e.lineno +
      ")",
  ),
);
window.addEventListener("unhandledrejection", (e) =>
  showErr(String((e.reason && e.reason.message) || e.reason)),
);

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
  elegan: {
    n: "Elegan",
    h: "superSTRAK",
    f: today,
    s: ["sparkle", "star", "sparkle", "star"],
  },
  hero: {
    n: "Hero Web",
    h: "HERO",
    f: "IT STARTS HERE",
    s: ["web", "burst", "mask", "bolt"],
  },
  multi: {
    n: "Multiverse",
    h: "MULTIVERSE",
    f: "EVERY MOMENT MATTERS",
    s: ["burst", "bolt", "sparkle", "star"],
  },
  armor: {
    n: "Armor Gold",
    h: "ARMOR UP",
    f: today,
    s: ["arc", "bolt", "star", "arc"],
  },
  comic: {
    n: "Komik hero",
    h: "POW!",
    f: "ISSUE #1 • " + today,
    s: ["burst", "bolt", "star", "burst"],
  },
  manga: {
    n: "Manga",
    h: "BAM!",
    f: "CHAPTER 1 • " + today,
    s: ["burst", "sparkle", "bolt", "star"],
  },
  popart: {
    n: "Pop art",
    h: "WOW!",
    f: today,
    s: ["burst", "star", "heart", "bolt"],
  },
  girly: {
    n: "Girly",
    h: "cutie ♡",
    f: today,
    s: ["bow", "flower", "heart", "sparkle"],
  },
  cat: {
    n: "Kucing",
    h: "meow ♡",
    f: "purr-fect • " + today,
    s: ["cat", "paw", "heart", "star"],
  },
  chatb: { n: "Chat Biru", h: "superSTRAK", f: "message", s: [] },
  chatg: { n: "Chat Abu", h: "superSTRAK", f: "message", s: [] },
  blob: {
    n: "Blob",
    h: "Captured",
    f: "in a soft moment • " + today,
    s: ["sparkle", "heart", "sparkle", "bow"],
  },
  checker: {
    n: "Checker",
    h: "good vibes",
    f: today,
    s: ["smile", "flower", "smile", "sparkle"],
  },
  denim: {
    n: "Denim",
    h: "denim days",
    f: today,
    s: ["star", "flower", "heart", "star"],
  },
  tiket: {
    n: "Tiket",
    h: "BOARDING PASS",
    f: "JKT → TYO • " + today,
    s: ["plane", "sparkle", "plane", "star"],
  },
  perangko: {
    n: "Perangko",
    h: "Series 1.0",
    f: "Happy Anniversary! • " + today,
    s: ["heart", "sparkle", "heart", "sparkle"],
  },
  retro: {
    n: "Retro",
    h: "untitled - superSTRAK",
    f: "For Help, press F1 • " + today,
    s: [],
  },
  rosso: {
    n: "F1 Rosso",
    h: "ROSSO CORSA",
    f: "RACE DAY • " + today,
    s: ["f1red", "flag", "trophy", "f1red"],
  },
  silver: {
    n: "F1 Silver",
    h: "SILVER ARROW",
    f: "GRID 01 • " + today,
    s: ["f1silver", "flag", "trophy", "f1silver"],
  },
  kart: {
    n: "Go-Kart",
    h: "GO-KART",
    f: "LAP 01 • " + today,
    s: ["kart", "flag", "trophy", "kart"],
  },
  film: { n: "Film 35mm", h: "35MM", f: "FRAME 12A • " + today, s: [] },
  vintage: {
    n: "Vintage",
    h: "Memories",
    f: today,
    s: ["flower", "sparkle", "rose", "sparkle"],
  },
};
// posisi stiker dekorasi: empat sudut, SELALU di dalam bingkai (px dari tepi)
const SPOTS = [
  { l: 4, t: 4 },
  { r: 4, t: 4 },
  { l: 4, b: 4 },
  { r: 4, b: 4 },
];
const COLORS = [
  "#0f2547",
  "#1f4fd8",
  "#dce8fb",
  "#e0243a",
  "#111111",
  "#ffffff",
  "#ffd1e3",
  "#e8d5ff",
  "#ffd93b",
  "#c8f7c5",
  "#ffcba4",
  "#a8c5b5",
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

/* ---------- foto: ratakan ke 4:3 supaya tidak gepeng ---------- */
function to43(src) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => {
      const W = 1024,
        H = 768,
        c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const s = Math.max(W / im.width, H / im.height),
        w = im.width * s,
        h = im.height * s;
      c.getContext("2d").drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
      res(c.toDataURL("image/jpeg", 0.9));
    };
    im.onerror = () => res(src);
    im.src = src;
  });
}

function renderPhotos() {
  photosDiv.innerHTML = "";
  if (!photos.length) {
    photosDiv.innerHTML =
      '<p class="empty">Belum ada foto. Kembali dan ambil foto dulu.</p>';
    return;
  }
  Promise.all(photos.map(to43)).then((list) => {
    photosDiv.innerHTML = "";
    list.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      photosDiv.appendChild(img);
    });
    fitStrip();
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

/* ---------- UNDUH ---------- */
(function () {
  const css = document.createElement("style");
  css.textContent =
    ".sheet{position:fixed;left:0;top:0;width:100%;height:100%;z-index:999;background:rgba(10,27,51,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;justify-content:safe center;gap:12px;overflow:auto;-webkit-overflow-scrolling:touch;" +
    "padding:max(60px,env(safe-area-inset-top)) 16px max(24px,env(safe-area-inset-bottom))}" +
    ".sheet img{flex:none;display:block;object-fit:contain;border-radius:6px;background:#fff;-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto}" +
    ".sheet p{color:#dce8fb;font-size:13px;text-align:center;max-width:34ch;line-height:1.55}" +
    ".sheet small{color:#8fa4c9;font-size:11px}" +
    ".sheet .acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}" +
    ".sheet .x{position:absolute;top:max(12px,env(safe-area-inset-top));right:14px;width:44px;height:44px;border-radius:50%;background:#fff;color:#0a1b33;font-size:22px;line-height:1}";
  document.head.appendChild(css);
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// canvas -> file PNG (dengan cadangan kalau toBlob mengembalikan kosong)
async function toPngBlob(canvas) {
  const b = await new Promise((r) => canvas.toBlob(r, "image/png"));
  if (b) return b;
  const bin = atob(canvas.toDataURL("image/png").split(",")[1]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: "image/png" });
}

function showSaveSheet(blob, filename, cw, ch) {
  const url = URL.createObjectURL(blob);
  const file = new File([blob], filename, { type: "image/png" });
  const box = document.createElement("div");
  box.className = "sheet";
  box.innerHTML =
    '<button class="x" aria-label="Tutup">✕</button>' +
    '<img alt="Hasil strip">' +
    "<p>Tekan <b>Simpan / Bagikan</b>, lalu pilih <b>Simpan Gambar</b>. " +
    "Atau tekan lama gambar di atas dan pilih <b>Simpan ke Foto</b>.</p>" +
    "<small>Ukuran file: " +
    cw +
    " × " +
    ch +
    " px</small>" +
    '<div class="acts"><button class="btn rec" id="shareBtn">Simpan / Bagikan</button>' +
    '<button class="btn ghost" id="closeSheet">Tutup</button></div>';
  const im = box.querySelector("img");
  // hitung ukuran tampil sendiri supaya proporsi selalu asli
  const maxW = Math.min(window.innerWidth - 32, 520),
    maxH = window.innerHeight * 0.5;
  const r = Math.min(maxW / cw, maxH / ch, 1);
  im.style.width = Math.round(cw * r) + "px";
  im.style.height = Math.round(ch * r) + "px";
  im.src = url;
  document.body.appendChild(box);

  const close = () => {
    box.remove();
    URL.revokeObjectURL(url);
  };
  box.querySelector(".x").addEventListener("click", close);
  box.querySelector("#closeSheet").addEventListener("click", close);
  box.addEventListener("click", (e) => {
    if (e.target === box) close(); // sentuh area gelap = tutup
  });
  box.querySelector("#shareBtn").addEventListener("click", async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "superSTRAK" });
      } else {
        alert("Tekan lama gambar lalu pilih Simpan ke Foto.");
      }
    } catch (e) {
      /* dibatalkan pengguna */
    }
  });
}

// Ikon call tidak ditambahkan ulang agar tidak double
function addChatIcon(root) {
  if (!theme.startsWith("chat")) return;

  const h = root.querySelector(".head");
  if (!h) return;

  // Jangan menambahkan ikon call/video call kedua kali.
  // Fungsi tetap tersedia agar proses simpan tidak error.
  h.classList.add("real-ico");
}

// kunci ukuran tiap foto dalam piksel supaya tidak gepeng
function lockPhotoSizes(root, sizes) {
  root.querySelectorAll(".photos img").forEach((im, i) => {
    if (!sizes[i]) return;
    im.style.width = sizes[i][0] + "px";
    im.style.height = sizes[i][1] + "px";
    im.style.aspectRatio = "auto";
  });
}

/* Cara 1 ("live"): strip di editor dikembalikan ke ukuran asli (tertutup layar
   "Menyiapkan gambar..."), difoto, lalu dikecilkan lagi. */
async function renderLive(sc) {
  cap.style.transform = "none";
  fit.style.width = fit.style.height = "";
  await nextFrame();
  await sleep(80);
  const sizes = [...photosDiv.querySelectorAll("img")].map((im) => [
    im.offsetWidth,
    im.offsetHeight,
  ]);
  try {
    return await html2canvas(cap, {
      scale: sc,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => {
        doc.body.classList.remove("edit-page");
        doc.getElementById("cap").style.transform = "none";
        const f = doc.getElementById("fit");
        f.style.width = f.style.height = "";
        lockPhotoSizes(doc.getElementById("strip"), sizes);
        addChatIcon(doc.getElementById("strip"));
      },
    });
  } finally {
    fitStrip();
  }
}

/* Cara 2 ("copy"): salinan strip berukuran asli di pojok halaman, lalu difoto. */
async function renderCopy(sc) {
  const box = document.createElement("div");
  box.className = "cap";
  box.style.cssText =
    "position:absolute;left:0;top:0;transform:none;z-index:997";
  const c = strip.cloneNode(true);
  c.removeAttribute("id");
  c.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
  c.querySelectorAll(".sel").forEach((e) => e.classList.remove("sel"));
  c.querySelectorAll("[contenteditable]").forEach((e) =>
    e.removeAttribute("contenteditable"),
  );
  box.appendChild(c);
  addChatIcon(c);
  document.body.appendChild(box);
  try {
    await nextFrame();
    await sleep(80);
    const sizes = [...c.querySelectorAll(".photos img")].map((im) => [
      im.offsetWidth,
      im.offsetHeight,
    ]);
    lockPhotoSizes(c, sizes);
    return await html2canvas(box, {
      scale: sc,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => {
        doc.body.classList.remove("edit-page");
        doc.body.style.overflow = "visible";
        doc.body.style.height = "auto";
        doc.documentElement.style.overflow = "visible";
      },
    });
  } finally {
    box.remove();
  }
}

$("downloadBtn").addEventListener("click", async () => {
  select(null); // hilangkan garis putus-putus
  const btn = $("downloadBtn"),
    label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Menyiapkan...";
  window.scrollTo(0, 0);

  // penutup layar: pengguna tidak melihat proses pemotretan
  const cover = document.createElement("div");
  cover.style.cssText =
    "position:fixed;left:0;top:0;width:100%;height:100%;z-index:998;background:#0a1b33;color:#fff;display:grid;place-items:center;font:600 15px sans-serif";
  cover.textContent = "Menyiapkan gambar...";
  document.body.appendChild(cover);

  const errs = [];
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    // coba 4 cara berurutan sampai ada yang berhasil
    const scales = isIOS ? [2, 1] : [3, 2];
    const attempts = [];
    scales.forEach((sc) => {
      attempts.push(["live", sc]);
      attempts.push(["copy", sc]);
    });

    let canvas = null;
    for (const [mode, sc] of attempts) {
      try {
        const c = mode === "live" ? await renderLive(sc) : await renderCopy(sc);
        if (c && c.width > 0 && c.height > 0) {
          canvas = c;
          break;
        }
        errs.push(mode + "@" + sc + ": gambar kosong");
      } catch (e) {
        errs.push(mode + "@" + sc + ": " + ((e && e.message) || e));
      }
    }
    if (!canvas) throw new Error(errs.join(" | ") || "Gagal membuat gambar");

    const blob = await toPngBlob(canvas);
    const name = "superSTRAK-" + theme + ".png";

    cover.remove();
    if (isIOS) {
      showSaveSheet(blob, name, canvas.width, canvas.height);
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
    cover.remove();
    const msg = (err && err.message) || String(err);
    showErr(msg);
    alert("Gagal membuat gambar.\n\nDetail: " + msg);
  } finally {
    cover.remove();
    fitStrip();
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
  showErr("Panel stiker: " + err.message);
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

