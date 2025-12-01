// ---------- SPA NAV ----------
function goPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active-tab"));
  const tabBtn = document.getElementById("tab-" + id);
  if (tabBtn) tabBtn.classList.add("active-tab");

  if (id === "archive") {
    loadArchive();
  }

  // Result가 아닐 때는 전체 배경 제거
  if (id !== "result") {
    document.body.classList.remove("leopard-bg");
    document.body.style.backgroundImage = "none";
  }
}

// ---------- 슬라이더 값 ----------
function getSliderValues() {
  return {
    complexity: Number(document.getElementById("s_complexity").value),
    softness:   Number(document.getElementById("s_softness").value),
    display:    Number(document.getElementById("s_display").value),
    chaos:      Number(document.getElementById("s_chaos").value),
    quirk:      Number(document.getElementById("s_quirk").value),
    rest:       Number(document.getElementById("s_rest").value)
  };
}

// ---------- 내부 엔진 파라미터 (hidden values) ----------
function getEngineParams(v) {
  const count = Math.round(10 + v.complexity * 1.1); // 10 ~ 120
  const round = (v.softness / 100) * 40;             // 0 ~ 40
  const band  = 5 + (v.display / 100) * 30;          // 5 ~ 35
  const gap   = -10 + (v.rest / 100) * 30;           // -10 ~ 20

  const turb  = v.chaos * 0.5;                       // 0 ~ 50
  const disp  = v.quirk * 0.4;                       // 0 ~ 40

  return { count, round, band, gap, turb, disp };
}

// ---------- ●●○○○ 표시 ----------
function toDots(v) {
  let n = Math.round(v / 20);
  if (n < 1) n = 1;
  if (n > 5) n = 5;
  return "●".repeat(n) + "○".repeat(5 - n);
}

// ---------- 타입 판별 ----------
function getLeopardType(v) {
  const hi = x => x >= 60;
  const lo = x => x <= 40;

  if (hi(v.softness) && hi(v.display) && !hi(v.chaos)) {
    return {
      name: "부드러운 존재감의 호피",
      line1: "현재 당신은 부드럽지만, 나를 살짝 보여주고 싶은 상태예요.",
      line2: "부드러운 얼룩으로 조용히 존재감을 드러내는 호피입니다."
    };
  }

  if (hi(v.softness) && lo(v.display) && hi(v.rest)) {
    return {
      name: "조용한 휴식의 호피",
      line1: "현재 당신은 다정하지만, 조금은 숨고 싶어 보여요.",
      line2: "패턴은 부드럽게 퍼지지만, 소리는 낮게 깔려 있는 호피입니다."
    };
  }

  if (lo(v.softness) && hi(v.display) && hi(v.chaos)) {
    return {
      name: "단단한 자기표현의 호피",
      line1: "현재 당신은 선명하게 말하고 싶고, 에너지도 강한 상태예요.",
      line2: "각진 얼룩과 대비로 존재감을 또렷하게 새기는 호피입니다."
    };
  }

  if (lo(v.softness) && lo(v.display) && hi(v.rest)) {
    return {
      name: "고요한 힘의 호피",
      line1: "겉으로는 조용하지만, 안쪽은 단단히 정돈된 상태예요.",
      line2: "조용하지만 쉽게 흔들리지 않는 내면의 무게가 느껴지는 호피입니다."
    };
  }

  if (hi(v.chaos) && hi(v.complexity)) {
    return {
      name: "빽빽한 흐름의 호피",
      line1: "생각도, 일도, 자극도 한꺼번에 많이 들어온 것 같아요.",
      line2: "패턴도 겹겹이 쌓여 어디를 봐도 바쁜 느낌이 나는 호피입니다."
    };
  }

  if (lo(v.chaos) && lo(v.complexity) && lo(v.display)) {
    return {
      name: "차분한 미니멀 호피",
      line1: "현재 당신은 덜어내고, 꼭 필요한 것만 남기고 싶은 상태예요.",
      line2: "패턴 밀도는 낮지만, 여백의 힘을 가지고 있는 차분한 호피입니다."
    };
  }

  if (!hi(v.complexity) && !lo(v.complexity) && hi(v.chaos) && hi(v.quirk)) {
    return {
      name: "흐린 꿈결같은 호피",
      line1: "현실과 상상 사이 어딘가에서 살짝 붕 떠 있는 상태예요.",
      line2: "얼룩들이 제멋대로 흩어져 있지만, 어딘가 몽환적인 균형을 가진 호피입니다."
    };
  }

  if (lo(v.display) && lo(v.chaos) && !hi(v.complexity)) {
    return {
      name: "차가운 균형의 호피",
      line1: "현재 당신은 감정보다 구조와 균형에 더 가까워 보이네요.",
      line2: "필요한 만큼만 드러내고, 선을 넘지 않는 절제된 호피입니다."
    };
  }

  if (hi(v.quirk) && hi(v.display)) {
    return {
      name: "엉뚱한 사건의 호피",
      line1: "조용한 흐름 속에서도 예상치 못한 작은 틈이 톡 하고 나타나요.",
      line2: "얼룩 사이사이에 불규칙한 변화가 반짝이는 호피입니다."
    };
  }

  return {
    name: "담담한 시선의 호피",
    line1: "강한 감정 없이, 주변을 천천히 관찰하는 순간이에요.",
    line2: "강하지만 고르게 번지며 담백하게 자리를 잡는 호피입니다."
  };
}

// ---------- Voronoi + 도넛 ----------
function drawPattern(v) {
  const svg = document.getElementById("previewSvg");
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = 520, H = 520;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const p = getEngineParams(v);

  const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
  const filter = document.createElementNS("http://www.w3.org/2000/svg","filter");
  filter.id = "noiseFilter";
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const feT = document.createElementNS("http://www.w3.org/2000/svg","feTurbulence");
  feT.setAttribute("type","fractalNoise");
  feT.setAttribute("baseFrequency",(p.turb/1000).toFixed(3));
  feT.setAttribute("numOctaves","2");
  feT.setAttribute("result","noise");

  const feD = document.createElementNS("http://www.w3.org/2000/svg","feDisplacementMap");
  feD.setAttribute("in","SourceGraphic");
  feD.setAttribute("in2","noise");
  feD.setAttribute("scale", p.disp.toFixed(1));
  feD.setAttribute("xChannelSelector","R");
  feD.setAttribute("yChannelSelector","G");

  filter.append(feT, feD);
  defs.appendChild(filter);
  svg.appendChild(defs);

  const centroid = poly => {
    const [sx, sy] = poly.reduce(
      ([ax, ay], [x, y]) => [ax + x, ay + y],
      [0, 0]
    );
    return [sx / poly.length, sy / poly.length];
  };

  const insetPolygon = (poly, dist) => {
    const c = centroid(poly);
    return poly.map(([x, y]) => [x - (x - c[0]) * dist, y - (y - c[1]) * dist]);
  };

  const lineIntersect = (p1, p2, a, b, c) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const den = a * dx + b * dy;
    if (Math.abs(den) < 1e-6) return null;
    const t = -(a * x1 + b * y1 + c) / den;
    return [x1 + t * dx, y1 + t * dy];
  };

  const clipPolygon = (poly, a, b, c) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const d1 = a * p1[0] + b * p1[1] + c;
      const d2 = a * p2[0] + b * p2[1] + c;
      const in1 = d1 >= 0;
      const in2 = d2 >= 0;

      if (in1 && in2) {
        out.push(p2);
      } else if (in1 && !in2) {
        const inter = lineIntersect(p1, p2, a, b, c);
        if (inter) out.push(inter);
      } else if (!in1 && in2) {
        const inter = lineIntersect(p1, p2, a, b, c);
        if (inter) out.push(inter);
        out.push(p2);
      }
    }
    return out;
  };

  const makeRoundedPath = (pts, r) => {
    if (!pts.length) return "";
    let d = "";
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];

      const v1 = [p1[0] - p0[0], p1[1] - p0[1]];
      const v2 = [p2[0] - p1[0], p2[1] - p1[1]];

      const l1 = Math.hypot(v1[0], v1[1]) || 1;
      const l2 = Math.hypot(v2[0], v2[1]) || 1;

      const r1 = Math.min(r, l1 / 2);
      const r2 = Math.min(r, l2 / 2);

      const p1a = [p1[0] - (v1[0] / l1) * r1, p1[1] - (v1[1] / l1) * r1];
      const p1b = [p1[0] + (v2[0] / l2) * r2, p1[1] + (v2[1] / l2) * r2];

      if (!i) d += `M${p1a[0]},${p1a[1]} `;
      else d += `L${p1a[0]},${p1a[1]} `;
      d += `Q${p1[0]},${p1[1]} ${p1b[0]},${p1b[1]} `;
    }
    d += "Z";
    return d;
  };

  const count = p.count;
  const round = p.round;
  const band  = p.band;
  const gap   = p.gap;

  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push([Math.random() * W, Math.random() * H]);
  }

  for (let i = 0; i < count; i++) {
    let cell = [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H]
    ];
    const pi = pts[i];

    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const pj = pts[j];

      let a = pj[0] - pi[0];
      let b = pj[1] - pi[1];
      const mx = (pi[0] + pj[0]) / 2;
      const my = (pi[1] + pj[1]) / 2;
      let c = -(a * mx + b * my);

      if (a * pi[0] + b * pi[1] + c < 0) {
        a = -a;
        b = -b;
        c = -c;
      }
      cell = clipPolygon(cell, a, b, c);
      if (!cell.length) break;
    }
    if (!cell.length) continue;

    cell = insetPolygon(cell, gap / 200);

    const outerRatio = 0.22;
    const innerRatio = Math.min(outerRatio + band / 100, 0.9);

    const outerPoly = insetPolygon(cell, outerRatio);
    const innerPoly = insetPolygon(cell, innerRatio);

    if (outerPoly.length < 3 || innerPoly.length < 3) continue;

    const dOuter = makeRoundedPath(outerPoly, round * 0.5);
    const dInner = makeRoundedPath(innerPoly, round * 0.35);

    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d", `${dOuter} ${dInner}`);
    path.setAttribute("fill-rule", "evenodd");

    const displayNorm = v.display / 100;
    const baseDark = 0.25 + displayNorm * 0.6;
    const jitter = (Math.random() - 0.5) * 0.15;
    const darkness = Math.max(0.2, Math.min(1, baseDark + jitter));
    const g = Math.round(255 * (1 - darkness));
    path.setAttribute("fill", `rgb(${g},${g},${g})`);

    const opacity = 0.25 + displayNorm * 0.6;
    path.setAttribute("fill-opacity", opacity.toFixed(2));

    path.setAttribute("filter", "url(#noiseFilter)");

    svg.appendChild(path);
  }
}

// ---------- Result 배경에 호피 타일링 ----------
function setResultBackground(svgString) {
  const resultSection = document.getElementById("result");
  if (!resultSection) return;

  let bgSvg = svgString
    .replace(/fill-opacity="[^"]*"/g, 'fill-opacity="0.06"')
    .replace(/fill="[^"]*"/g, 'fill="#000000"');

  const encoded = encodeURIComponent(bgSvg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  const url = `url("data:image/svg+xml,${encoded}")`;

  resultSection.style.backgroundImage = url;
}

// ---------- 전역 상태 ----------
let currentLeopard = null;
let archiveSortMode = "time-desc"; // 기본: 최근 순

// ---------- 지금의 호피 뽑기 ----------
function generateLeopard() {
  const sliders = getSliderValues();
  const engine  = getEngineParams(sliders);
  const typeInfo = getLeopardType(sliders);

  drawPattern(sliders);

  const previewSvg = document.getElementById("previewSvg");
  const clone = previewSvg.cloneNode(true);

  const resultImage = document.getElementById("resultImage");
  resultImage.innerHTML = "";
  resultImage.appendChild(clone);

  const resultType = document.getElementById("resultType");
  resultType.textContent = `지금의 호피 타입: “${typeInfo.name}”`;

  const statsDiv = document.getElementById("resultStats");
  statsDiv.innerHTML = "";
  const stats = [
    ["활기",    sliders.complexity],
    ["말랑함",  sliders.softness],
    ["드러냄",sliders.display],
    ["혼란도",  sliders.chaos],
    ["엉뚱함",  sliders.quirk],
    ["여유",    sliders.rest]
  ];
  stats.forEach(([label, val]) => {
    const row = document.createElement("div");
    row.className = "stat-line";
    const left = document.createElement("span");
    left.className = "stat-label";
    left.textContent = label;
    const right = document.createElement("span");
    right.className = "stat-dots";
    right.textContent = toDots(val);
    row.appendChild(left);
    row.appendChild(right);
    statsDiv.appendChild(row);
  });

  const desc = document.getElementById("resultDescription");
  desc.innerHTML = `“${typeInfo.line1}”<br>“${typeInfo.line2}”`;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(previewSvg);

  setResultBackground(svgString);

  currentLeopard = {
    timestamp: Date.now(),
    sliders,
    engineParams: engine,
    type: typeInfo.name,
    line1: typeInfo.line1,
    line2: typeInfo.line2,
    svg: svgString
  };

  goPage("result");
}

// ---------- Firestore + localStorage에 저장 ----------
function saveToArchive(silent) {
  if (!currentLeopard) {
    if (!silent) alert("먼저 지금의 호피를 생성해주세요.");
    return;
  }

  const key = "leopardArchive";
  const raw = localStorage.getItem(key);
  let list = [];
  if (raw) {
    try { list = JSON.parse(raw); } catch(e) { list = []; }
  }
  if (!Array.isArray(list)) list = [];
  list.push(currentLeopard);
  if (list.length > 200) list = list.slice(list.length - 200);
  localStorage.setItem(key, JSON.stringify(list));

  try {
    if (window.firebase && firebase.firestore) {
      const db = firebase.firestore();

      const svgString = currentLeopard.svg;
      const base64 = btoa(unescape(encodeURIComponent(svgString)));
      const dataUrl = "data:image/svg+xml;base64," + base64;

      db.collection("archives").add({
        thumbnailUrl: dataUrl,
        sliders: currentLeopard.sliders,
        engineParams: currentLeopard.engineParams,
        type: currentLeopard.type,
        line1: currentLeopard.line1,
        line2: currentLeopard.line2,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (e) {
    console.error("Firestore 저장 오류:", e);
  }

  if (!silent) {
    alert("Leopard Moments에 저장되었습니다 🐆");
  }
}

// ---------- PNG 저장 (투명 배경) ----------
function saveCurrentAsPNG() {
  const resultSvgEl = document.querySelector("#resultImage svg");
  const svgEl = resultSvgEl || document.getElementById("previewSvg");

  if (!svgEl || !svgEl.querySelector("path")) {
    alert("먼저 호피를 생성해주세요.");
    return;
  }

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = function() {
    const W = 520, H = 520;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(url);

    const pngURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = pngURL;
    a.download = `momentary_leopard_${stamp}.png`;
    a.click();
  };
  img.src = url;
}

// ---------- 아카이브 항목을 Result 페이지로 복원 ----------
function showArchiveLeopard(item) {
  if (!item || !item.svg) return;

  currentLeopard = {
    timestamp: item.timestamp || Date.now(),
    sliders: item.sliders || {},
    engineParams: item.engineParams || null,
    type: item.type || "",
    line1: item.line1 || "",
    line2: item.line2 || "",
    svg: item.svg
  };

  const resultImage = document.getElementById("resultImage");
  resultImage.innerHTML = item.svg;

  const resultType = document.getElementById("resultType");
  resultType.textContent = `지금의 호피 타입: “${currentLeopard.type}”`;

  const statsDiv = document.getElementById("resultStats");
  statsDiv.innerHTML = "";

  const sliders = currentLeopard.sliders || {};
  const stats = [
    ["활기",    sliders.complexity ?? 0],
    ["말랑함",  sliders.softness   ?? 0],
    ["드러냄",sliders.display    ?? 0],
    ["혼란도",  sliders.chaos      ?? 0],
    ["엉뚱함",  sliders.quirk      ?? 0],
    ["여유",    sliders.rest       ?? 0]
  ];

  stats.forEach(([label, val]) => {
    const row = document.createElement("div");
    row.className = "stat-line";

    const left = document.createElement("span");
    left.className = "stat-label";
    left.textContent = label;

    const right = document.createElement("span");
    right.className = "stat-dots";
    right.textContent = toDots(val);

    row.appendChild(left);
    row.appendChild(right);
    statsDiv.appendChild(row);
  });

  const desc = document.getElementById("resultDescription");
  if (currentLeopard.line1 || currentLeopard.line2) {
    desc.innerHTML = `“${currentLeopard.line1}”<br>“${currentLeopard.line2}”`;
  } else {
    desc.textContent = "";
  }

  setResultBackground(currentLeopard.svg);
  goPage("result");
}

// ---------- 아카이브 정렬 ----------
function sortArchiveList(list, mode) {
  const arr = [...list];

  const safeTime = item => item && item.timestamp ? item.timestamp : 0;

  const safeSoft = item =>
    item && item.sliders && typeof item.sliders.softness === "number"
      ? item.sliders.softness
      : 0;

  const safeChaos = item =>
    item && item.sliders && typeof item.sliders.chaos === "number"
      ? item.sliders.chaos
      : 0;

  const safeRest = item =>
    item && item.sliders && typeof item.sliders.rest === "number"
      ? item.sliders.rest
      : 0;

  switch (mode) {
    case "time-asc":
      arr.sort((a, b) => safeTime(a) - safeTime(b));
      break;

    case "soft-desc":
      arr.sort((a, b) => safeSoft(b) - safeSoft(a));
      break;

    case "soft-asc":
      arr.sort((a, b) => safeSoft(a) - safeSoft(b));
      break;

    case "chaos-desc":
      arr.sort((a, b) => safeChaos(b) - safeChaos(a));
      break;

    case "chaos-asc":
      arr.sort((a, b) => safeChaos(a) - safeChaos(b));
      break;

    case "rest-desc":
      arr.sort((a, b) => safeRest(b) - safeRest(a));
      break;

    case "rest-asc":
      arr.sort((a, b) => safeRest(a) - safeRest(b));
      break;

    case "time-desc":
    default:
      arr.sort((a, b) => safeTime(b) - safeTime(a));
      break;
  }

  return arr;
}

// ---------- 아카이브 불러오기 (localStorage 기준) ----------
function loadArchive() {
  const key = "leopardArchive";
  const container = document.getElementById("archiveList");
  const archiveSection = document.getElementById("archive");

  archiveSection.querySelectorAll(".archive-info, .archive-empty").forEach(el => el.remove());
  container.innerHTML = "";

  const raw = localStorage.getItem(key);
  if (!raw) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "아직 저장된 호피가 없습니다.";
    archiveSection.insertBefore(empty, container);
    return;
  }

  let list;
  try {
    list = JSON.parse(raw);
  } catch (e) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "저장된 데이터를 읽을 수 없습니다.";
    archiveSection.insertBefore(empty, container);
    return;
  }

  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "아직 저장된 호피가 없습니다.";
    archiveSection.insertBefore(empty, container);
    return;
  }

  const sorted = sortArchiveList(list, archiveSortMode);

  const info = document.createElement("p");
  info.className = "archive-info";
  info.textContent = `총 ${sorted.length}개의 Momentary Leopard가 기록되어 있어요.`;
  archiveSection.insertBefore(info, container);

  sorted.forEach(item => {
    if (!item || !item.svg) return;

    const tile = document.createElement("div");
    tile.className = "archive-tile";

    try {
      const encodedSvg = encodeURIComponent(item.svg)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      tile.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
    } catch (e) {
      return;
    }

    const time = new Date(item.timestamp || Date.now());
    const timeStr = time.toLocaleString("ko-KR", {
      year: "2-digit", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });

    const overlay = document.createElement("div");
    overlay.className = "archive-tile-info";
    overlay.innerHTML = `
      <div class="archive-tile-type">${item.type || ""}</div>
      <div class="archive-tile-time">${timeStr}</div>
    `;
    tile.appendChild(overlay);

    tile.addEventListener("click", () => {
      showArchiveLeopard(item);
    });

    container.appendChild(tile);
  });
}

// ---------- 초기 로딩 ----------
window.addEventListener("load", () => {
  drawPattern(getSliderValues());

  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener("input", () => {
      drawPattern(getSliderValues());
    });
  });

  document.getElementById("btn-generate").addEventListener("click", generateLeopard);
  document.getElementById("btn-save-archive").addEventListener("click", () => saveToArchive(false));
  document.getElementById("btn-save-png").addEventListener("click", saveCurrentAsPNG);

  const sortSelect = document.getElementById("archiveSort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      archiveSortMode = e.target.value;
      loadArchive();
    });
  }

  if (location.hash === "#archive") {
    goPage("archive");
  } else if (location.hash === "#result") {
    goPage("result");
  }
});
