// Stiker tambahan: mobil F1, kart, pesawat, smiley, jaring, topeng, reaktor.
// Dimuat SETELAH stickers.js dan SEBELUM edit.js.
const _f1 = (c, a) =>
  _svg(
    `<rect x="2" y="16" width="11" height="3.5" fill="${a}"/><rect x="6" y="18" width="2.5" height="15" fill="#14213a"/>` +
      `<path d="M6 41L10 30L27 29L35 23.5L42 29L60 35.5L61 41Z" fill="${c}" stroke="#14213a" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M12 34H58" stroke="${a}" stroke-width="2"/>` +
      `<circle cx="33" cy="26" r="4.2" fill="#14213a"/><path d="M31 25h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` +
      `<rect x="54" y="41" width="9" height="3" rx="1" fill="${a}" stroke="#14213a" stroke-width="1"/>` +
      `<circle cx="16" cy="43" r="8.5" fill="#111"/><circle cx="16" cy="43" r="3.4" fill="#cfd4db"/>` +
      `<circle cx="48" cy="43" r="8.5" fill="#111"/><circle cx="48" cy="43" r="3.4" fill="#cfd4db"/>`,
  );

const _web = (() => {
  let s =
    '<g fill="none" stroke="#2b3550" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    s += `<path d="M32 32L${(32 + Math.cos(a) * 28).toFixed(1)} ${(32 + Math.sin(a) * 28).toFixed(1)}"/>`;
  }
  [9, 18, 27].forEach((r) => {
    s += `<polygon points="${_star(8, 32, 32, r, r * 0.8)}"/>`;
  });
  return s + "</g>";
})();

Object.assign(SK, {
  f1red: { n: "Mobil F1 merah", src: _f1("#d4001f", "#ffd400") },
  f1silver: { n: "Mobil F1 perak", src: _f1("#c5ccd4", "#00c2b0") },
  kart: {
    n: "Go-kart",
    src: _svg(
      `<rect x="6" y="37" width="52" height="9" rx="4" fill="#ff7a00" stroke="#14213a" stroke-width="2"/>` +
        `<rect x="14" y="27" width="18" height="12" rx="3" fill="#14213a"/>` +
        `<circle cx="24" cy="22" r="6" fill="#ffd400" stroke="#14213a" stroke-width="2"/><path d="M24 20h7" stroke="#14213a" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M44 36L48 27" stroke="#14213a" stroke-width="2.5" stroke-linecap="round"/><rect x="43" y="24" width="10" height="3" rx="1.5" fill="#14213a"/>` +
        `<circle cx="14" cy="47" r="8" fill="#111"/><circle cx="14" cy="47" r="3" fill="#cfd4db"/>` +
        `<circle cx="50" cy="47" r="8" fill="#111"/><circle cx="50" cy="47" r="3" fill="#cfd4db"/>`,
    ),
  },
  plane: {
    n: "Pesawat kertas",
    src: _svg(
      `<path d="M4 30L60 6 40 58 31 36z" fill="#7cc8ff" stroke="#14213a" stroke-width="2.5" stroke-linejoin="round"/><path d="M31 36L60 6" stroke="#14213a" stroke-width="2.5"/>`,
    ),
  },
  smile: {
    n: "Smiley",
    src: _svg(
      `<circle cx="32" cy="32" r="26" fill="#ffd93b" stroke="#14213a" stroke-width="2.5"/><circle cx="23" cy="26" r="3.2" fill="#14213a"/><circle cx="41" cy="26" r="3.2" fill="#14213a"/><path d="M19 38q13 14 26 0" fill="none" stroke="#14213a" stroke-width="3" stroke-linecap="round"/>`,
    ),
  },
  web: { n: "Jaring", src: _svg(_web) },
  mask: {
    n: "Topeng hero",
    src: _svg(
      `<path d="M4 26C14 18 24 24 32 24S50 18 60 26C58 42 46 44 40 38 36 34 28 34 24 38 18 44 6 42 4 26z" fill="#d6203a" stroke="#14213a" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<ellipse cx="19" cy="31" rx="6" ry="4" transform="rotate(12 19 31)" fill="#fff"/><ellipse cx="45" cy="31" rx="6" ry="4" transform="rotate(-12 45 31)" fill="#fff"/>`,
    ),
  },
  arc: {
    n: "Reaktor",
    src: _svg(
      `<circle cx="32" cy="32" r="27" fill="#0b2a4a" stroke="#9aa6b2" stroke-width="3"/><circle cx="32" cy="32" r="18" fill="none" stroke="#7de8ff" stroke-width="4"/><circle cx="32" cy="32" r="8" fill="#e9fdff"/>` +
        `<path d="M32 5v9M32 50v9M5 32h9M50 32h9" stroke="#9aa6b2" stroke-width="3" stroke-linecap="round"/>`,
    ),
  },
});

SK_ORDER.push(
  "f1red",
  "f1silver",
  "kart",
  "plane",
  "smile",
  "web",
  "mask",
  "arc",
);
