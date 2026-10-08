const $ = (id) => document.getElementById(id);
const video = $("video"),
  countdown = $("countdown"),
  photosDiv = $("photos"),
  flash = $("flash");
const layoutSelect = $("layoutSelect"),
  fileInput = $("fileInput");
const MAX = 6;
let photoList = [],
  filter = "none",
  busy = false;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const EMPTY = '<p class="empty">Belum ada foto.</p>';
const CAM_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/></svg>';

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "user" } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch(() =>
    alert("Kamera tidak bisa diakses. Kamu masih bisa memakai Upload foto."),
  );

document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    video.style.filter = filter === "none" ? "" : filter;
  });
});

function clearPhotos() {
  photoList = [];
  photosDiv.classList.remove("two");
  photosDiv.innerHTML = EMPTY;
}

function addPhoto(data) {
  photoList.push(data);
  if (photoList.length === 1) photosDiv.innerHTML = "";
  photosDiv.classList.toggle("two", photoList.length > 4);
  const img = document.createElement("img");
  img.src = data;
  photosDiv.appendChild(img);
}

function doFlash() {
  flash.classList.remove("go");
  void flash.offsetWidth;
  flash.classList.add("go");
}

function takePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.filter = filter;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  addPhoto(canvas.toDataURL("image/jpeg", 0.92));
}

/* ---------- upload dari perangkat ---------- */
async function fileToData(file) {
  const bmp = await createImageBitmap(file);
  const W = 1280,
    H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  // potong tengah ke rasio 4:3 (cover)
  const s = Math.max(W / bmp.width, H / bmp.height);
  const w = bmp.width * s,
    h = bmp.height * s;
  canvas.getContext("2d").drawImage(bmp, (W - w) / 2, (H - h) / 2, w, h);
  return canvas.toDataURL("image/jpeg", 0.9);
}

$("uploadBtn").addEventListener("click", () => {
  if (!busy) fileInput.click();
});
fileInput.addEventListener("change", async () => {
  const files = [...fileInput.files].filter((f) => f.type.startsWith("image/"));
  fileInput.value = "";
  for (const f of files) {
    if (photoList.length >= MAX) {
      alert("Maksimal " + MAX + " foto.");
      break;
    }
    try {
      addPhoto(await fileToData(f));
    } catch {
      alert("Foto " + f.name + " tidak bisa dibaca.");
    }
  }
});

function save() {
  try {
    localStorage.setItem("photoStrip", JSON.stringify(photoList));
    localStorage.setItem("layout", layoutSelect.value);
    return true;
  } catch {
    alert("Penyimpanan penuh. Kurangi jumlah foto lalu coba lagi.");
    return false;
  }
}

async function startPhotobooth() {
  if (busy) return;
  if (!video.videoWidth) {
    alert("Kamera belum siap. Izinkan akses kamera lalu tunggu gambar muncul.");
    return;
  }
  busy = true;
  clearPhotos();
  const total = parseInt(layoutSelect.value, 10);

  for (let n = 0; n < total; n++) {
    for (let i = 3; i >= 1; i--) {
      countdown.innerHTML = `<div class="count">${i}</div>`;
      await wait(1000);
    }
    countdown.innerHTML = `<div class="count ico">${CAM_ICON}</div>`;
    doFlash();
    takePhoto();
    await wait(600);
    countdown.innerHTML = "";
    await wait(500);
  }
  save();
  busy = false;
}

$("startBtn").addEventListener("click", startPhotobooth);
$("retakeBtn").addEventListener("click", startPhotobooth);
$("deleteBtn").addEventListener("click", () => {
  if (!busy) clearPhotos();
});
$("editBtn").addEventListener("click", () => {
  if (!photoList.length)
    return alert("Ambil atau upload foto terlebih dahulu!");
  if (save()) location.href = "edit.html";
});
