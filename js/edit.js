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

const canvasToBlob = (canvas) => new Promise((res) => canvas.toBlob(res, "image/png"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    "<small>Ukuran file: " + cw + " × " + ch + " px</small>" +
    '<div class="acts"><button class="btn rec" id="shareBtn">Simpan / Bagikan</button>' +
    '<button class="btn ghost" id="closeSheet">Tutup</button></div>';
  const im = box.querySelector("img");
  const maxW = Math.min(window.innerWidth - 32, 520), maxH = window.innerHeight * 0.5;
  const r = Math.min(maxW / cw, maxH / ch, 1);
  im.style.width = Math.round(cw * r) + "px";
  im.style.height = Math.round(ch * r) + "px";
  im.src = url;
  document.body.appendChild(box);

  const close = () => { box.remove(); URL.revokeObjectURL(url); };
  box.querySelector(".x").addEventListener("click", close);
  box.querySelector("#closeSheet").addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  box.querySelector("#shareBtn").addEventListener("click", async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "superSTRAK" });
      } else {
        alert("Tekan lama gambar lalu pilih Simpan ke Foto.");
      }
    } catch (e) { /* dibatalkan pengguna */ }
  });
}

// salinan strip berukuran asli, khusus untuk dipotret
function buildExport() {
  const box = document.createElement("div");
  box.className = "cap";
  box.style.cssText = "position:absolute;left:0;top:0;transform:none;z-index:997";
  const c = strip.cloneNode(true);
  c.removeAttribute("id");
  c.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
  c.querySelectorAll(".sel").forEach((e) => e.classList.remove("sel"));
  c.querySelectorAll("[contenteditable]").forEach((e) => e.removeAttribute("contenteditable"));
  box.appendChild(c);

  if (theme.startsWith("chat")) {
    const h = c.querySelector(".head");
    h.classList.add("real-ico");
    const im = document.createElement("img");
    im.src = CHAT_ICON;
    im.width = 46; im.height = 18;
    im.style.cssText = "display:block;flex:none;width:46px;height:18px";
    h.appendChild(im);
  }
  document.body.appendChild(box);

  // kunci ukuran foto dalam piksel supaya tidak gepeng
  c.querySelectorAll(".photos img").forEach((im) => {
    const w = im.offsetWidth, h = im.offsetHeight;
    im.style.width = w + "px";
    im.style.height = h + "px";
    im.style.aspectRatio = "auto";
  });
  return box;
}

$("downloadBtn").addEventListener("click", async () => {
  select(null);
  const btn = $("downloadBtn"), label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Menyiapkan...";
  window.scrollTo(0, 0);

  const cover = document.createElement("div");
  cover.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;z-index:998;background:#0a1b33;color:#fff;display:grid;place-items:center;font:600 15px sans-serif";
  cover.textContent = "Menyiapkan gambar...";
  document.body.appendChild(cover);

  let box = null;
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    box = buildExport();
    await sleep(150);

    let canvas = null, lastErr = null;
    for (const sc of isIOS ? [2, 1] : [3, 2]) {
      try {
        canvas = await html2canvas(box, {
          scale: sc, useCORS: true, backgroundColor: null, logging: false, scrollX: 0, scrollY: 0,
        });
        break;
      } catch (e) { lastErr = e; }
    }
    if (!canvas) throw lastErr || new Error("Gagal membuat gambar");

    const blob = await canvasToBlob(canvas);
    if (!blob) throw new Error("Gagal membuat file gambar");
    const name = "superSTRAK-" + theme + ".png";

    cover.remove();
    if (isIOS) {
      showSaveSheet(blob, name, canvas.width, canvas.height);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
  } catch (err) {
    console.error(err);
    showErr(err.message || String(err));
    alert("Gagal membuat gambar. Coba lagi, atau kurangi jumlah stiker.");
  } finally {
    if (box) box.remove();
    cover.remove();
    btn.disabled = false;
    btn.textContent = label;
  }
});
