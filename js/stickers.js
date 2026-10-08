// Stiker vektor (SVG), gaya flat dengan garis tipis. Tanpa emoji.
const _svg = (body) =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${body}</svg>`,
  );

// bintang / ledakan bergerigi
const _star = (n, cx, cy, R, r) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / n,
      d = i % 2 ? r : R;
    return (
      (cx + Math.cos(a) * d).toFixed(1) +
      "," +
      (cy + Math.sin(a) * d).toFixed(1)
    );
  }).join(" ");

// bunga lima kelopak (x, y, r harus angka)
const _petals = (x, y, r, fill, center, line) => {
  x = Number(x);
  y = Number(y);
  const pr = r * 0.62;
  const pts = [0, 72, 144, 216, 288].map((d) => {
    const t = (d * Math.PI) / 180;
    return [x + Math.sin(t) * r * 0.85, y - Math.cos(t) * r * 0.85];
  });
  return (
    pts
      .map(
        (p) =>
          `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(pr + 1.5).toFixed(1)}" fill="${line}"/>`,
      )
      .join("") +
    pts
      .map(
        (p) =>
          `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${pr.toFixed(1)}" fill="${fill}"/>`,
      )
      .join("") +
    `<circle cx="${x}" cy="${y}" r="${(r * 0.42).toFixed(1)}" fill="${center}"/>`
  );
};

// bendera kotak-kotak
const _flag = (() => {
  let c = "";
  for (let y = 0; y < 3; y++)
    for (let x = 0; x < 4; x++)
      c += `<rect x="${16 + x * 10}" y="${8 + y * 10}" width="10" height="10" fill="${(x + y) % 2 ? "#fff" : "#14213a"}"/>`;
  return (
    `<rect x="10" y="6" width="4" height="54" rx="2" fill="#14213a"/>` +
    c +
    `<rect x="16" y="8" width="40" height="30" fill="none" stroke="#14213a" stroke-width="2"/>`
  );
})();

// mahkota bunga (bunga berjajar di lengkungan)
const _wreath = (() => {
  const cols = ["#ff9ab8", "#ffffff", "#ffd36b", "#ffffff", "#ff9ab8"];
  let s = `<path d="M4 50Q32 10 60 50" fill="none" stroke="#5c9b6a" stroke-width="3.5" stroke-linecap="round"/>`;
  [0.12, 0.31, 0.5, 0.69, 0.88].forEach((t, i) => {
    const x = (1 - t) ** 2 * 4 + 2 * (1 - t) * t * 32 + t * t * 60;
    const y = (1 - t) ** 2 * 50 + 2 * (1 - t) * t * 10 + t * t * 50;
    s += _petals(x, y, 6.5, cols[i], "#e8b93a", "#b9728e");
  });
  return s;
})();

const SK = {
  tophat: {
    n: "Topi tinggi",
    src: _svg(
      `<ellipse cx="32" cy="50" rx="27" ry="7" fill="#14213a"/><path d="M17 50V16a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v34z" fill="#1d2f55"/><rect x="17" y="38" width="30" height="8" fill="#e0243a"/><path d="M22 16v20" stroke="#fff" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>`,
    ),
  },
  crown: {
    n: "Mahkota",
    src: _svg(
      `<path d="M8 46L12 20l12 12 8-18 8 18 12-12 4 26z" fill="#e8b93a" stroke="#a87a12" stroke-width="2.5" stroke-linejoin="round"/><rect x="8" y="46" width="48" height="8" rx="2" fill="#e8b93a" stroke="#a87a12" stroke-width="2.5"/><circle cx="12" cy="18" r="3" fill="#e0243a"/><circle cx="32" cy="12" r="3" fill="#e0243a"/><circle cx="52" cy="18" r="3" fill="#e0243a"/>`,
    ),
  },
  partyhat: {
    n: "Topi pesta",
    src: _svg(
      `<path d="M32 8L51 54H13z" fill="#7cc8ff" stroke="#14213a" stroke-width="2.5" stroke-linejoin="round"/><rect x="12" y="52" width="40" height="5" rx="2.5" fill="#e0243a"/><circle cx="32" cy="7" r="5" fill="#e0243a"/><g fill="#fff"><circle cx="30" cy="30" r="2.6"/><circle cx="37" cy="40" r="2.6"/><circle cx="25" cy="44" r="2.6"/></g>`,
    ),
  },
  beret: {
    n: "Baret",
    src: _svg(
      `<ellipse cx="32" cy="36" rx="27" ry="15" fill="#c2273d" stroke="#7a1527" stroke-width="2.5"/><path d="M14 30q18-16 36 0" fill="none" stroke="#7a1527" stroke-opacity=".5" stroke-width="2"/><rect x="29.5" y="14" width="5" height="9" rx="2.5" fill="#7a1527"/>`,
    ),
  },
  sunglasses: {
    n: "Kacamata hitam",
    src: _svg(
      `<rect x="5" y="22" width="24" height="19" rx="8" fill="#14213a"/><rect x="35" y="22" width="24" height="19" rx="8" fill="#14213a"/><path d="M29 28q3-3 6 0" fill="none" stroke="#14213a" stroke-width="3"/><path d="M5 26L2 24M59 26l3-2" stroke="#14213a" stroke-width="3" stroke-linecap="round"/><path d="M10 28h7M40 28h7" stroke="#fff" stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>`,
    ),
  },
  glasses: {
    n: "Kacamata bulat",
    src: _svg(
      `<circle cx="19" cy="34" r="13" fill="#fff" fill-opacity=".18" stroke="#c9972b" stroke-width="3"/><circle cx="45" cy="34" r="13" fill="#fff" fill-opacity=".18" stroke="#c9972b" stroke-width="3"/><path d="M31 32q1-3 2 0" fill="none" stroke="#c9972b" stroke-width="3"/><path d="M6 31L2 28M58 31l4-3" stroke="#c9972b" stroke-width="3" stroke-linecap="round"/>`,
    ),
  },
  mustache: {
    n: "Kumis",
    src: _svg(
      `<path d="M32 30C28 24 18 24 8 28C8 38 20 40 26 36C29 34 31 33 32 34C33 33 35 34 38 36C44 40 56 38 56 28C46 24 36 24 32 30Z" fill="#3a2616"/>`,
    ),
  },
  catears: {
    n: "Kuping kucing",
    src: _svg(
      `<path d="M8 52Q32 38 56 52" fill="none" stroke="#14213a" stroke-width="4" stroke-linecap="round"/><path d="M10 46L14 12L30 40z" fill="#14213a"/><path d="M54 46L50 12L34 40z" fill="#14213a"/><path d="M16 38L17.5 22L26 36z" fill="#ff9ab8"/><path d="M48 38L46.5 22L38 36z" fill="#ff9ab8"/>`,
    ),
  },
  bunnyears: {
    n: "Kuping kelinci",
    src: _svg(
      `<ellipse cx="22" cy="24" rx="7" ry="20" transform="rotate(-12 22 24)" fill="#fff" stroke="#14213a" stroke-width="2.5"/><ellipse cx="22" cy="26" rx="3.5" ry="14" transform="rotate(-12 22 26)" fill="#ffb3cc"/><ellipse cx="42" cy="24" rx="7" ry="20" transform="rotate(12 42 24)" fill="#fff" stroke="#14213a" stroke-width="2.5"/><ellipse cx="42" cy="26" rx="3.5" ry="14" transform="rotate(12 42 26)" fill="#ffb3cc"/>`,
    ),
  },
  halo: {
    n: "Halo",
    src: _svg(
      `<ellipse cx="32" cy="34" rx="24" ry="9" fill="none" stroke="#c9972b" stroke-width="6"/><ellipse cx="32" cy="34" rx="24" ry="9" fill="none" stroke="#ffe48a" stroke-width="3"/>`,
    ),
  },
  flowercrown: { n: "Mahkota bunga", src: _svg(_wreath) },
  flower: {
    n: "Bunga",
    src: _svg(_petals(32, 32, 14, "#ffffff", "#e8b93a", "#c9a0b3")),
  },
  sakura: {
    n: "Sakura",
    src: _svg(_petals(32, 32, 14, "#ffc2d6", "#e0457a", "#e58aa8")),
  },
  rose: {
    n: "Mawar",
    src: _svg(
      `<ellipse cx="14" cy="52" rx="9" ry="4" transform="rotate(-25 14 52)" fill="#5c9b6a"/><ellipse cx="50" cy="52" rx="9" ry="4" transform="rotate(25 50 52)" fill="#5c9b6a"/><circle cx="32" cy="30" r="21" fill="#d6384f"/><circle cx="32" cy="30" r="14" fill="#ea5a6e"/><path d="M24 30a8 8 0 0 1 16 0 5 5 0 0 1-10 0 2.5 2.5 0 0 1 5 0" fill="none" stroke="#a81c35" stroke-width="2.5" stroke-linecap="round"/>`,
    ),
  },
  heart: {
    n: "Hati",
    src: _svg(
      `<path d="M32 54C10 38 6 24 14 16c6-6 14-3 18 4 4-7 12-10 18-4 8 8 4 22-18 38z" fill="#e0405e"/><path d="M16 22q2-6 8-6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.5" stroke-linecap="round"/>`,
    ),
  },
  star: {
    n: "Bintang",
    src: _svg(
      `<polygon points="${_star(5, 32, 34, 27, 12)}" fill="#f2c230" stroke="#b88a10" stroke-width="2.5" stroke-linejoin="round"/>`,
    ),
  },
  sparkle: {
    n: "Kilau",
    src: _svg(
      `<path d="M32 4C34 22 42 30 60 32 42 34 34 42 32 60 30 42 22 34 4 32 22 30 30 22 32 4z" fill="#f2c230"/><path d="M32 16C33 26 38 30 48 32 38 34 33 38 32 48 31 38 26 34 16 32 26 30 31 26 32 16z" fill="#fff4c4"/>`,
    ),
  },
  bow: {
    n: "Pita",
    src: _svg(
      `<path d="M29 37L20 57l9-5z" fill="#e8609f" stroke="#c43d78" stroke-width="2" stroke-linejoin="round"/><path d="M35 37l9 20-9-5z" fill="#e8609f" stroke="#c43d78" stroke-width="2" stroke-linejoin="round"/><path d="M32 32L8 18v28z" fill="#ff7eb6" stroke="#c43d78" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 32l24-14v28z" fill="#ff7eb6" stroke="#c43d78" stroke-width="2.5" stroke-linejoin="round"/><rect x="26" y="26" width="12" height="12" rx="4" fill="#ff7eb6" stroke="#c43d78" stroke-width="2.5"/>`,
    ),
  },
  burst: {
    n: "Ledakan komik",
    src: _svg(
      `<polygon points="${_star(12, 32, 32, 29, 18)}" fill="#ffd93b" stroke="#111" stroke-width="3" stroke-linejoin="round"/><polygon points="${_star(12, 32, 32, 16, 10)}" fill="#e0243a"/>`,
    ),
  },
  bolt: {
    n: "Petir",
    src: _svg(
      `<path d="M36 4L12 36h14l-4 24 26-34H34z" fill="#ffd93b" stroke="#111" stroke-width="3" stroke-linejoin="round"/>`,
    ),
  },
  flag: { n: "Bendera balap", src: _svg(_flag) },
  trophy: {
    n: "Piala",
    src: _svg(
      `<path d="M20 12h-8c0 10 4 14 10 14M44 12h8c0 10-4 14-10 14" fill="none" stroke="#b88a10" stroke-width="3"/><path d="M20 8h24v14a12 12 0 0 1-24 0z" fill="#f2c230" stroke="#b88a10" stroke-width="2.5"/><rect x="29" y="34" width="6" height="10" fill="#d9a617"/><rect x="20" y="44" width="24" height="9" rx="2" fill="#f2c230" stroke="#b88a10" stroke-width="2.5"/>`,
    ),
  },
  paw: {
    n: "Jejak kaki",
    src: _svg(
      `<g fill="#7a4a2b"><ellipse cx="32" cy="42" rx="14" ry="11"/><circle cx="14" cy="28" r="6"/><circle cx="26" cy="16" r="6.5"/><circle cx="38" cy="16" r="6.5"/><circle cx="50" cy="28" r="6"/></g>`,
    ),
  },
  cat: {
    n: "Kucing",
    src: _svg(
      `<path d="M10 14l14 8h16l14-8v28a22 18 0 0 1-44 0z" fill="#ffb26b" stroke="#7a4a2b" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="36" r="2.8" fill="#3a2616"/><circle cx="40" cy="36" r="2.8" fill="#3a2616"/><path d="M29 41h6l-3 3z" fill="#e0607a"/><path d="M32 44q-3 4-6 2M32 44q3 4 6 2" fill="none" stroke="#7a4a2b" stroke-width="1.8" stroke-linecap="round"/><path d="M12 40h8M12 46l8-2M52 40h-8M52 46l-8-2" stroke="#7a4a2b" stroke-width="1.8" stroke-linecap="round"/>`,
    ),
  },
};

// urutan di panel stiker
const SK_ORDER = [
  "tophat",
  "crown",
  "partyhat",
  "beret",
  "sunglasses",
  "glasses",
  "mustache",
  "catears",
  "bunnyears",
  "halo",
  "flowercrown",
  "flower",
  "sakura",
  "rose",
  "heart",
  "star",
  "sparkle",
  "bow",
  "burst",
  "bolt",
  "flag",
  "trophy",
  "paw",
  "cat",
];
