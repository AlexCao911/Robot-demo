const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadRobotEyes() {
  const styleProperties = {};
  const face = {
    classList: { add() {}, remove() {} },
    dataset: {},
    offsetWidth: 800,
    style: { setProperty(name, value) { styleProperties[name] = value; } },
  };
  const window = {
    addEventListener() {},
    clearTimeout() {},
    innerHeight: 390,
    innerWidth: 844,
    location: { search: "?staticTest=1" },
    setInterval() {},
    setTimeout() {},
  };
  const context = vm.createContext({
    document: { querySelector: () => face },
    Math,
    URLSearchParams,
    window,
  });
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  vm.runInContext(source, context);
  return { face, robotEyes: window.robotEyes, styleProperties };
}

test("cute expression set replaces technology-focused states", () => {
  const { robotEyes } = loadRobotEyes();

  assert.deepEqual(
    [...robotEyes.expressions],
    [
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
    ],
  );
  assert.equal(robotEyes.expressions.includes("scan"), false);
  assert.equal(robotEyes.expressions.includes("alert"), false);
});

test("new cute expressions can be selected directly", () => {
  const { face, robotEyes } = loadRobotEyes();

  robotEyes.setExpression("shy");
  assert.equal(face.dataset.expression, "shy");
  robotEyes.setExpression("peek");
  assert.equal(face.dataset.expression, "peek");
  robotEyes.setExpression("giggle");
  assert.equal(face.dataset.expression, "giggle");
  robotEyes.setExpression("pleading");
  assert.equal(face.dataset.expression, "pleading");
  robotEyes.setExpression("oops");
  assert.equal(face.dataset.expression, "oops");
});

test("numeric expression navigation wraps in both directions", () => {
  const { face, robotEyes } = loadRobotEyes();

  robotEyes.setExpression(-1);
  assert.equal(face.dataset.expression, "cool");
  robotEyes.setExpression(robotEyes.expressions.length);
  assert.equal(face.dataset.expression, "neutral");
});

test("gaze movement supports expressive timing", () => {
  const { robotEyes, styleProperties } = loadRobotEyes();

  robotEyes.setLook(12, -4, 240);
  assert.equal(styleProperties["--look-x"], "12px");
  assert.equal(styleProperties["--look-y"], "-4px");
  assert.equal(styleProperties["--look-duration"], "240ms");
});

test("mobile taps expose varied character reactions", () => {
  const { face, robotEyes } = loadRobotEyes();

  assert.deepEqual(
    [...robotEyes.tapReactions],
    ["boop", "bounce", "wiggle", "startled", "bashful", "nuzzle-left", "nuzzle-right"],
  );
  robotEyes.triggerTapReaction("boop");
  assert.equal(face.dataset.reaction, "boop");
  robotEyes.triggerTapReaction("nuzzle-left");
  assert.equal(face.dataset.reaction, "nuzzle-left");
});

test("landscape phone viewport uses mobile tap behavior", () => {
  const { robotEyes } = loadRobotEyes();

  assert.equal(robotEyes.isMobileInteraction({ pointerType: "mouse" }), true);
  assert.equal(robotEyes.isMobileInteraction({ pointerType: "touch" }), true);
});

test("consecutive taps avoid repeating the same reaction", () => {
  const { robotEyes } = loadRobotEyes();

  robotEyes.triggerTapReaction("boop");
  assert.equal(robotEyes.chooseTapReaction(["boop", "bounce"], 0), "bounce");
});
