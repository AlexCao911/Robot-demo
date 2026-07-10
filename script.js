const face = document.querySelector("#face");
const params = new URLSearchParams(window.location.search);

const expressions = [
  "neutral",
  "happy",
  "delighted",
  "giggle",
  "curious",
  "expectant",
  "adoring",
  "pleading",
  "shy",
  "playful",
  "mischievous",
  "peek",
  "proud",
  "relieved",
  "pouty",
  "oops",
  "wink",
  "sleepy",
  "surprised",
  "squint",
  "skeptical",
  "thinking",
  "angry",
  "cool",
];

const expressionTiming = {
  neutral: [2800, 4400],
  happy: [3000, 4200],
  delighted: [2800, 4000],
  giggle: [3000, 4200],
  curious: [3200, 4600],
  expectant: [3400, 4800],
  adoring: [3800, 5200],
  pleading: [3800, 5200],
  shy: [3400, 4700],
  playful: [3000, 4300],
  mischievous: [3200, 4500],
  peek: [3500, 4800],
  proud: [3000, 4300],
  relieved: [3600, 5000],
  pouty: [3400, 4700],
  oops: [3000, 4200],
  wink: [2600, 3800],
  sleepy: [3800, 5200],
  surprised: [2600, 3600],
  squint: [2800, 4000],
  skeptical: [3000, 4400],
  thinking: [3400, 4800],
  angry: [2800, 4000],
  cool: [6000, 6800],
};

const expressionPool = [
  "neutral",
  "neutral",
  "happy",
  "happy",
  "delighted",
  "giggle",
  "giggle",
  "curious",
  "curious",
  "expectant",
  "expectant",
  "adoring",
  "pleading",
  "shy",
  "playful",
  "playful",
  "mischievous",
  "peek",
  "proud",
  "relieved",
  "pouty",
  "oops",
  "wink",
  "sleepy",
  "surprised",
  "squint",
  "skeptical",
  "thinking",
  "angry",
  "cool",
];
const gazePoints = [
  [0, 0],
  [-22, -5],
  [21, -4],
  [15, 7],
  [-15, 7],
  [0, -9],
  [8, 2],
  [-7, 1],
  [0, 0],
];

const tapReactions = [
  "boop",
  "bounce",
  "wiggle",
  "startled",
  "bashful",
  "nuzzle-left",
  "nuzzle-right",
];

const reactionDurations = {
  boop: 540,
  bounce: 760,
  wiggle: 700,
  startled: 720,
  bashful: 880,
  "nuzzle-left": 820,
  "nuzzle-right": 820,
};

const reactionExpressions = {
  boop: ["giggle", "happy", "wink"],
  bounce: ["delighted", "expectant", "happy"],
  wiggle: ["playful", "mischievous", "giggle"],
  startled: ["oops", "surprised"],
  bashful: ["shy", "pleading", "pouty"],
  "nuzzle-left": ["adoring", "curious", "happy"],
  "nuzzle-right": ["adoring", "curious", "happy"],
};

let expressionIndex = 0;
let gazeIndex = 0;
let expressionTimer = null;
let blinkTimer = null;
let blinkLockUntil = 0;
let expressionCueTimers = [];
let reactionTimer = null;
let lastTapReaction = "";

function clearExpressionCues() {
  expressionCueTimers.forEach((timer) => window.clearTimeout(timer));
  expressionCueTimers = [];
}

function queueExpressionCue(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  expressionCueTimers.push(timer);
}

function runBlinkClass(className, duration) {
  window.clearTimeout(blinkTimer);
  face.classList.remove("blink", "blink-left", "blink-right");
  void face.offsetWidth;
  face.style.setProperty("--blink-duration", `${duration}ms`);
  face.classList.add(className);
  blinkTimer = window.setTimeout(() => face.classList.remove(className), duration);
}

function blinkOne(side = "left", duration = 190) {
  runBlinkClass(side === "right" ? "blink-right" : "blink-left", duration);
}

function triggerTapReaction(reaction) {
  if (!tapReactions.includes(reaction)) {
    return;
  }

  window.clearTimeout(reactionTimer);
  face.dataset.reaction = "";
  void face.offsetWidth;
  face.dataset.reaction = reaction;
  lastTapReaction = reaction;

  const matchingExpressions = reactionExpressions[reaction];
  const nextExpression = matchingExpressions[Math.floor(Math.random() * matchingExpressions.length)];
  setExpression(nextExpression);

  if (reaction === "boop") {
    blink(135);
  } else if (reaction === "wiggle") {
    window.setTimeout(() => blinkOne("right", 160), 260);
  }

  reactionTimer = window.setTimeout(() => {
    if (face.dataset.reaction === reaction) {
      face.dataset.reaction = "";
    }
  }, reactionDurations[reaction]);
}

function chooseTapReaction(candidates, randomValue = Math.random()) {
  const nonRepeating = candidates.filter((reaction) => reaction !== lastTapReaction);
  const pool = nonRepeating.length > 0 ? nonRepeating : candidates;
  return pool[Math.floor(randomValue * pool.length)];
}

function isMobileInteraction(event) {
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  return event.pointerType === "touch"
    || event.pointerType === "pen"
    || window.matchMedia?.("(pointer: coarse)").matches
    || shortEdge <= 500;
}

function addExpressionCues(expression) {
  const cue = (callback, delay) => queueExpressionCue(callback, delay);
  if (expression === "happy") {
    blinkLockUntil = Date.now() + 1200;
    cue(() => blink(150), 260);
    cue(() => blink(140), 620);
  } else if (expression === "playful") {
    blinkLockUntil = Date.now() + 1500;
    cue(() => blinkOne("right", 180), 880);
  } else if (expression === "proud") {
    blinkLockUntil = Date.now() + 1400;
    cue(() => blinkOne("left", 210), 640);
  } else if (expression === "wink") {
    blinkLockUntil = Date.now() + 900;
    cue(() => blinkOne("left", 230), 260);
  } else if (expression === "sleepy") {
    blinkLockUntil = Date.now() + 1900;
    cue(() => blink(420), 920);
  } else if (expression === "shy") {
    blinkLockUntil = Date.now() + 1400;
    cue(() => blink(200), 780);
  } else if (expression === "giggle") {
    blinkLockUntil = Date.now() + 1500;
    cue(() => blink(155), 320);
    cue(() => blink(135), 690);
  } else if (expression === "expectant") {
    blinkLockUntil = Date.now() + 1900;
    cue(() => blink(175), 1280);
  } else if (expression === "adoring") {
    blinkLockUntil = Date.now() + 1800;
    cue(() => blink(280), 860);
  } else if (expression === "pleading") {
    blinkLockUntil = Date.now() + 1900;
    cue(() => blink(310), 1050);
  } else if (expression === "mischievous") {
    blinkLockUntil = Date.now() + 1400;
    cue(() => blinkOne("right", 205), 760);
  } else if (expression === "relieved") {
    blinkLockUntil = Date.now() + 1600;
    cue(() => blink(370), 460);
  } else if (expression === "pouty") {
    blinkLockUntil = Date.now() + 1500;
    cue(() => blink(230), 780);
  } else if (expression === "oops") {
    blinkLockUntil = Date.now() + 1100;
    cue(() => blink(125), 350);
    cue(() => blink(115), 640);
  }
}

function setExpression(value) {
  const targetIndex = typeof value === "string" ? expressions.indexOf(value) : value;
  if (typeof value === "string" && targetIndex < 0) {
    return;
  }
  clearExpressionCues();
  expressionIndex = (targetIndex + expressions.length) % expressions.length;
  const expression = expressions[expressionIndex];
  face.classList.remove("blink", "blink-left", "blink-right");
  face.dataset.expression = "";
  void face.offsetWidth;
  face.dataset.expression = expression;
  addExpressionCues(expression);
}

function setLook(x, y, duration = 600) {
  const safeDuration = Math.max(120, Math.min(1400, duration));
  face.style.setProperty("--look-x", `${x}px`);
  face.style.setProperty("--look-y", `${y}px`);
  face.style.setProperty("--look-duration", `${safeDuration}ms`);
}

function blink(duration = 190) {
  runBlinkClass("blink", duration);
}

function scheduleBlink() {
  const delay = 1800 + Math.random() * 3000;
  window.setTimeout(() => {
    if (Date.now() >= blinkLockUntil) {
      blink(Math.random() > 0.86 ? 240 : 180);
      if (Math.random() > 0.78) {
        window.setTimeout(() => blink(135), 290);
      }
    }
    scheduleBlink();
  }, delay);
}

function scheduleGaze() {
  const delay = 700 + Math.random() * 1500;
  window.setTimeout(() => {
    const step = 1 + Math.floor(Math.random() * (gazePoints.length - 1));
    gazeIndex = (gazeIndex + step) % gazePoints.length;
    const [x, y] = gazePoints[gazeIndex];
    const quickGlance = Math.random() > 0.72;
    setLook(x, y, quickGlance ? 190 : 520 + Math.random() * 380);

    if (quickGlance) {
      window.setTimeout(() => setLook(x * 0.35, y * 0.35, 680), 430 + Math.random() * 180);
    }
    scheduleGaze();
  }, delay);
}

function getExpressionDelay(expression) {
  const [minimum, maximum] = expressionTiming[expression];
  return minimum + Math.random() * (maximum - minimum);
}

function chooseNextExpression() {
  let nextExpression = expressionPool[Math.floor(Math.random() * expressionPool.length)];
  while (nextExpression === expressions[expressionIndex]) {
    nextExpression = expressionPool[Math.floor(Math.random() * expressionPool.length)];
  }
  return nextExpression;
}

function scheduleExpressionLoop() {
  window.clearTimeout(expressionTimer);
  const delay = getExpressionDelay(expressions[expressionIndex]);
  expressionTimer = window.setTimeout(() => {
    setExpression(chooseNextExpression());
    scheduleExpressionLoop();
  }, delay);
}

window.addEventListener("pointermove", (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const x = Math.max(-20, Math.min(20, (event.clientX - centerX) / 22));
  const y = Math.max(-8, Math.min(8, (event.clientY - centerY) / 30));
  setLook(x, y, 180);
});

window.addEventListener("pointerdown", (event) => {
  if (isMobileInteraction(event)) {
    const towardTap = event.clientX < window.innerWidth / 2 ? "nuzzle-left" : "nuzzle-right";
    const availableReactions = tapReactions.filter((reaction) => !reaction.startsWith("nuzzle"));
    availableReactions.push(towardTap);
    const reaction = chooseTapReaction(availableReactions);
    triggerTapReaction(reaction);
  } else {
    setExpression(expressionIndex + 1);
    blink(240);
  }
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
if (params.has("expression")) {
  setExpression(params.get("expression"));
}
if (!params.has("staticTest")) {
  scheduleBlink();
  scheduleGaze();
  scheduleExpressionLoop();
}

window.robotEyes = {
  blink,
  blinkOne,
  chooseTapReaction,
  expressions: [...expressions],
  setExpression,
  setLook,
  isMobileInteraction,
  tapReactions: [...tapReactions],
  triggerTapReaction,
};

if (params.has("blinkTest")) {
  window.setTimeout(() => blink(1200), 600);
}
