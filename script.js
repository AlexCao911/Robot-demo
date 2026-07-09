const face = document.querySelector("#face");
const params = new URLSearchParams(window.location.search);

const expressions = [
  "neutral",
  "happy",
  "delighted",
  "curious",
  "squint",
  "surprised",
  "angry",
  "wink",
  "skeptical",
  "alert",
  "cool",
  "thinking",
  "scan",
  "sleepy",
];
const gazePoints = [
  [0, 0],
  [-28, -4],
  [26, -3],
  [18, 9],
  [-18, 8],
  [0, -10],
  [0, 0],
];

let expressionIndex = 0;
let gazeIndex = 0;
let expressionTimer = null;

function setExpression(value) {
  const targetIndex = typeof value === "string" ? expressions.indexOf(value) : value;
  if (targetIndex < 0) {
    return;
  }
  expressionIndex = (targetIndex + expressions.length) % expressions.length;
  face.dataset.expression = expressions[expressionIndex];
  face.classList.remove("pop");
  void face.offsetWidth;
  face.classList.add("pop");
  window.setTimeout(() => face.classList.remove("pop"), 340);
}

function setLook(x, y) {
  face.style.setProperty("--look-x", `${x}px`);
  face.style.setProperty("--look-y", `${y}px`);
}

function blink(duration = 220) {
  face.style.setProperty("--blink-duration", `${duration}ms`);
  face.classList.add("blink");
  window.setTimeout(() => face.classList.remove("blink"), duration);
}

function scheduleBlink() {
  const delay = 2200 + Math.random() * 3600;
  window.setTimeout(() => {
    blink(Math.random() > 0.82 ? 280 : 220);
    if (Math.random() > 0.72) {
      window.setTimeout(() => blink(150), 320);
    }
    scheduleBlink();
  }, delay);
}

function scheduleExpressionLoop() {
  window.clearTimeout(expressionTimer);
  const delay = expressions[expressionIndex] === "cool"
    ? 6800 + Math.random() * 200
    : 1800 + Math.random() * 2800;
  expressionTimer = window.setTimeout(() => {
    let nextIndex = Math.floor(Math.random() * expressions.length);
    if (nextIndex === expressionIndex) {
      nextIndex = (nextIndex + 1) % expressions.length;
    }
    setExpression(nextIndex);
    if (Math.random() > 0.64) {
      blink(180);
    }
    scheduleExpressionLoop();
  }, delay);
}

window.setInterval(() => {
  gazeIndex = (gazeIndex + 1) % gazePoints.length;
  const [x, y] = gazePoints[gazeIndex];
  setLook(x, y);
}, 850);

window.addEventListener("pointermove", (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const x = Math.max(-20, Math.min(20, (event.clientX - centerX) / 22));
  const y = Math.max(-8, Math.min(8, (event.clientY - centerY) / 30));
  setLook(x, y);
});

window.addEventListener("pointerdown", () => {
  setExpression(expressionIndex + 1);
  blink(240);
  if (!params.has("staticTest")) {
    scheduleExpressionLoop();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "ArrowRight") {
    setExpression(expressionIndex + 1);
    blink(240);
  }
  if (event.key === "ArrowLeft") {
    setExpression(expressionIndex - 1);
    blink(240);
  }
});

setExpression(0);
if (params.has("coolTest")) {
  setExpression("cool");
}
if (!params.has("staticTest")) {
  scheduleBlink();
  scheduleExpressionLoop();
}

window.robotEyes = { blink, setExpression };

if (params.has("blinkTest")) {
  window.setTimeout(() => blink(1200), 600);
}
