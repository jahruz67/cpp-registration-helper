// Run with: node --test scripts/test-userscript.cjs
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../userscript/cpp-registration-helper.user.js"), "utf8");
function load(names, globals = {}) {
  const context = vm.createContext(globals);
  for (const name of names) {
    const match = source.match(new RegExp(`  function ${name}\\([^]*?\\n  \\}`));
    assert.ok(match, `Missing function: ${name}`);
    vm.runInContext(match[0], context);
  }
  return context;
}

test("rating text and accessible labels remain present in every color state", () => {
  const context = load(["setProfessorScore"]);
  for (const [value, text, state] of [
    [0, "0.0", "low"], [1.2, "1.2", "low"], [2.9, "2.9", "low"],
    [3, "3.0", "medium"], [3.9, "3.9", "medium"], [4, "4.0", "high"],
    [5, "5.0", "high"], [null, "N/A", "unavailable"], [NaN, "N/A", "unavailable"]
  ]) {
    const element = { dataset: {}, setAttribute(name, value) { this[name] = value; } };
    context.setProfessorScore(element, value);
    assert.equal(element.textContent, text);
    assert.equal(element.dataset.cppScore, state);
    assert.ok(element["aria-label"].includes(text === "N/A" ? "unavailable" : text));
  }
});

function menu(rect, width = 800, height = 600) {
  const list = { style: { maxHeight: "280px" }, get offsetHeight() { return Math.min(280, parseFloat(this.style.maxHeight)); } };
  const panel = { hidden: false, style: {}, get offsetHeight() { return list.offsetHeight + 40; } };
  let closed = false;
  const context = load(["position"], { innerWidth: width, innerHeight: height, close() { closed = true; } });
  context.position({ input: { getBoundingClientRect: () => rect }, list, panel });
  return { list, panel, closed };
}

test("course suggestions open above fields near the bottom of the viewport", () => {
  const { panel } = menu({ top: 540, bottom: 570, left: 100, right: 250, width: 150 });
  assert.equal(parseFloat(panel.style.top), 216);
  assert.ok(parseFloat(panel.style.top) + panel.offsetHeight < 540);
});

test("course suggestions shrink and stay inside a narrow, short viewport", () => {
  const { panel, list } = menu({ top: 95, bottom: 125, left: 280, right: 315, width: 35 }, 320, 240);
  assert.equal(parseFloat(panel.style.width), 304);
  assert.equal(parseFloat(panel.style.left), 8);
  assert.ok(parseFloat(list.style.maxHeight) < 280);
  assert.ok(parseFloat(panel.style.top) + panel.offsetHeight <= 232);
});

test("course suggestions remain below fields with room, and close for offscreen fields", () => {
  assert.equal(menu({ top: 50, bottom: 80, left: 100, right: 250, width: 150 }).panel.style.top, "84px");
  assert.equal(menu({ top: -50, bottom: -20, left: 100, right: 250, width: 150 }).closed, true);
});

test("a failed professor lookup is shared briefly, then a later search can recover", async () => {
  const timers = [];
  let calls = 0;
  const context = load(["professorLookup"], {
    professorRequests: new Map(),
    CPPCatalog: { request() { return ++calls === 1 ? Promise.reject(new Error("offline")) : Promise.resolve({ rating: 4 }); } },
    setTimeout(fn, delay) { assert.equal(delay, 60000); timers.push(fn); }
  });
  const failed = context.professorLookup("Professor");
  await assert.rejects(failed, /offline/);
  assert.equal(context.professorLookup("Professor"), failed);
  timers[0]();
  assert.equal((await context.professorLookup("Professor")).rating, 4);
  assert.equal(calls, 2);
});

test("reopening professor details retries a failed request", async () => {
  let calls = 0;
  const state = { result: { status: "found", url: "profile" }, rating: { setAttribute() {} } };
  const context = load(["updateProfessorPopover", "showProfessorPopover"], {
    activeProfessor: state, professorPinned: false, professorCloseTimer: 0,
    professorPopover: { panel: { isConnected: true } }, professorDetailRequests: new Map(),
    clearTimeout() {}, renderProfessorPopover() {}, positionProfessorPopover() {},
    CPPCatalog: { request() { return ++calls === 1 ? Promise.reject(new Error("offline")) : Promise.resolve({ difficulty: 3 }); } }
  });
  context.showProfessorPopover(state);
  await new Promise(setImmediate);
  assert.equal(state.detailsError, true);
  assert.equal(context.professorDetailRequests.size, 0);
  context.showProfessorPopover(state);
  await new Promise(setImmediate);
  assert.equal(state.detailsError, false);
  assert.equal(state.details.difficulty, 3);
  assert.equal(calls, 2);
});
