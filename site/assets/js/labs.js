import { models, motionSamples } from "./lab-models.js";
import { drawPoles, poleSummary } from "./lab-poles.js";
import { drawLabMotion } from "./lab-motion.js";
import { activatePlayback } from "./lab-playback.js";

for (const lab of document.querySelectorAll("[data-model]")) {
  const model = models[lab.dataset.model];
  if (model) activateLab(lab, model);
}

function activateLab(lab, model) {
  const live = lab.querySelector(".lab-live");
  const controls = Array.from(live.querySelectorAll(".lab-control"), (control) => {
    const input = control.querySelector("input");
    return {
      input,
      output: control.querySelector("output"),
      container: control,
      mode: control.dataset.dampingControl,
      decimals: input.step.split(".")[1]?.length ?? 0
    };
  });
  const [primary, ...extraControls] = controls;
  const canvas = lab.querySelector(".lab-chart");
  const metrics = lab.querySelector(".lab-metrics");
  const key = lab.querySelector(".lab-key");
  const buttons = Array.from(lab.querySelectorAll("[data-value]"));
  const dampingMode = lab.querySelector("[data-damping-mode]");
  const poleCanvas = lab.querySelector(".lab-pole-chart");
  const poleContext = poleCanvas?.getContext("2d");
  const flowCanvas = lab.querySelector(".lab-flow-chart");
  const flowContext = flowCanvas?.getContext("2d");
  const context = canvas.getContext("2d");
  if (!context) return;

  function readCase(readValue, mode) {
    return {
      value: readValue(primary.input),
      parameters: Object.fromEntries(extraControls.filter((control) => !control.mode || control.mode === mode)
        .map(({ input }) => [input.dataset.parameter, readValue(input)]))
    };
  }

  const start = readCase((input) => Number(input.defaultValue), dampingMode?.value);
  let selected = start;
  let currentPoles = model.poles?.(start.value, start.parameters);
  const poleBaseline = Math.max(.01, ...(currentPoles ?? []).map(([re, im]) => Math.hypot(re, im)));
  const motionCanvas = lab.querySelector(".lab-motion-chart");
  const motionValue = lab.querySelector(".lab-motion-value");
  const instruments = Array.from(lab.querySelectorAll("[data-instrument]"), (element) => ({
    element,
    key: element.dataset.instrument,
    unit: element.dataset.unit,
    scale: Number(element.dataset.scale)
  }));
  const motion = motionCanvas && activatePlayback(live, model.xMax, renderFrame);

  if (flowContext) {
    const items = model.flowChart.series.map(({label, color, dash}) => {
      const item = document.createElement("li");
      const swatch = document.createElement("span");
      swatch.style.borderColor = color;
      if (dash.length) swatch.style.borderTopStyle = "dashed";
      swatch.setAttribute("aria-hidden", "true");
      item.append(swatch, label);
      return item;
    });
    lab.querySelector(".lab-flow-key").replaceChildren(...items);
  }

  function renderFrame(time) {
    const state = model.value(time, selected.value, selected.parameters);
    const sample = motionSamples[lab.dataset.model](time, selected.value, selected.parameters, state);
    const reading = drawLabMotion(motionCanvas, lab.dataset.model, sample);
    if (instruments.length) {
      for (const { element, key, unit, scale } of instruments) {
        const value = sample[key] * scale;
        const display = Math.abs(value) < .005 ? "0.00" : value.toFixed(2);
        element.textContent = display + (unit === "°" ? "" : " ") + unit;
      }
    } else {
      motionValue.textContent = reading;
    }
    drawChart(canvas, context, model, selected, start, time, state);
    if (flowContext) drawChart(flowCanvas, flowContext, model.flowChart, selected, start, time);
  }

  function updateMode() {
    for (const { container, mode } of controls) {
      container.hidden = Boolean(mode && mode !== dampingMode?.value);
    }
    const useRatio = dampingMode?.value !== "coefficient";
    for (const button of buttons) button.hidden = !useRatio;
  }

  function draw() {
    if (motion) motion.show();
    else drawChart(canvas, context, model, selected, start);
    if (poleContext) drawPoles(poleCanvas, poleContext, currentPoles, poleBaseline);
  }

  function update() {
    motion?.pause();
    selected = readCase((input) => input.valueAsNumber, dampingMode?.value);
    for (const { input, output, decimals } of controls) {
      const unit = output.dataset.unit;
      const display = input.valueAsNumber.toFixed(decimals) + (unit ? " " + unit : "");
      output.value = display;
      input.setAttribute("aria-valuetext", display);
    }
    if (model.companion) {
      key.textContent = model.companionKey;
    } else {
      key.textContent = selected.value === start.value
        && Object.entries(selected.parameters).every(([name, value]) => start.parameters[name] === value)
        ? "The selected response matches the starting case."
        : "Solid line: selected case. Dashed line: starting case.";
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.value) === selected.value));
    }

    const results = model.metrics(selected.value, selected.parameters);
    if (poleContext) {
      currentPoles = model.poles(selected.value, selected.parameters);
      const summary = poleSummary(currentPoles);
      results.push(["Selected poles (s⁻¹)", summary, {
        valueTex: summary.replace("±", "\\pm").replace(", repeated", "\\quad\\text{(repeated)}")
      }]);
      poleCanvas.setAttribute("aria-label", `Real versus imaginary pole plot. Selected: ${summary} per second.`);
    }
    const items = results.map(([name, result, math]) => {
      const group = document.createElement("div");
      const label = document.createElement("dt");
      const detail = document.createElement("dd");
      label.textContent = name;
      detail.textContent = result;
      if (window.katex && math?.labelTex) {
        window.katex.render(math.labelTex, label);
      }
      if (window.katex && math?.valueTex) {
        window.katex.render(math.valueTex, detail);
      }
      group.append(label, detail);
      return group;
    });
    metrics.replaceChildren(...items);
    canvas.setAttribute("aria-label", model.label + " versus time. " +
      results.map(([label, value]) => label + ": " + value).join(". ") + ".");
    draw();
  }

  for (const { input } of controls) input.addEventListener("input", update);
  for (const button of buttons) {
    button.addEventListener("click", () => {
      primary.input.value = button.dataset.value;
      update();
    });
  }
  lab.querySelector("[data-reset]").addEventListener("click", () => {
    for (const { input } of controls) input.value = input.defaultValue;
    if (dampingMode) dampingMode.value = "ratio";
    motion?.reset();
    updateMode();
    update();
  });
  dampingMode?.addEventListener("change", () => {
    updateMode();
    update();
  });

  if (lab.dataset.model === "first-order" && new URLSearchParams(location.search).get("case") === "slow") {
    primary.input.value = 2;
  }
  if (lab.dataset.model === "second-order") {
    const workedLink = document.querySelector('a[href="?case=worked#interactive-lab"]');
    workedLink?.addEventListener("click", () => {
      if (new URLSearchParams(location.search).get("case") === "worked") {
        applyMechanicalCase("worked");
        updateMode();
        update();
      }
    });
    function applyMechanicalCase(preset) {
      dampingMode.value = "coefficient";
      for (const { input } of controls) input.value = input.defaultValue;
      if (preset === "worked") {
        live.querySelector('[data-parameter="stiffness"]').value = 5;
        live.querySelector('[data-parameter="damping"]').value = 4;
      } else {
        const supplied = new URLSearchParams(location.search).get("damping");
        const value = Number(supplied);
        const input = live.querySelector('[data-parameter="damping"]');
        if (supplied?.trim() && Number.isFinite(value) && value >= Number(input.min) && value <= Number(input.max)) {
          input.value = supplied;
        }
      }
      motion?.reset();
    }
    const preset = new URLSearchParams(location.search).get("case");
    if (preset === "worked" || preset === "challenge") applyMechanicalCase(preset);
  }
  updateMode();
  live.hidden = false;
  update();
  const resize = new ResizeObserver(draw);
  resize.observe(canvas);
  if (poleContext) resize.observe(poleCanvas);
  if (flowContext) resize.observe(flowCanvas);
  if (motionCanvas) resize.observe(motionCanvas);
}

function drawChart(canvas, context, model, selected, start, timeMarker, state) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width < 100 || height < 100) return;

  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const bounds = { left: 53, right: width - 15, top: 28, bottom: height - 38 };
  const x = (time) => bounds.left + time / model.xMax * (bounds.right - bounds.left);
  const y = (response) => bounds.bottom - (response - model.min) / (model.max - model.min) * (bounds.bottom - bounds.top);

  context.font = "11px system-ui, sans-serif";
  context.strokeStyle = "#e9e1ef";
  context.fillStyle = "#514858";
  context.lineWidth = 1;
  for (let tick = 0; tick <= 4; tick += 1) {
    const time = model.xMax * tick / 4;
    const response = model.min + (model.max - model.min) * tick / 4;
    const xTick = x(time);
    const yTick = y(response);
    context.beginPath();
    context.moveTo(xTick, bounds.top);
    context.lineTo(xTick, bounds.bottom);
    context.moveTo(bounds.left, yTick);
    context.lineTo(bounds.right, yTick);
    context.stroke();
    context.textAlign = "right";
    context.fillText(response.toFixed(model.digits), bounds.left - 7, yTick + 4);
    context.textAlign = "center";
    context.fillText(String(time), xTick, bounds.bottom + 15);
  }
  context.textAlign = "left";
  context.fillText(model.label, bounds.left, 17);
  context.textAlign = "center";
  context.fillText("Time (s)", (bounds.left + bounds.right) / 2, height - 6);

  const mainColor = model.color ?? (model.companion ? "#2d668a" : "#973e00");
  const curves = model.series?.map((line) => ({ ...line, settings: selected })) ?? [
    { value: model.companion ?? model.value, settings: model.companion ? selected : start, color: "#8a639f", dash: [6, 4] },
    { value: model.value, settings: selected, color: mainColor, dash: [] }
  ];
  const sampleTimes = Array.from({ length: 261 }, (_, index) => model.xMax * index / 260);
  for (const curve of curves) {
    context.beginPath();
    context.strokeStyle = curve.color;
    context.setLineDash(curve.dash);
    context.lineWidth = 2.25;
    const times = curve.eventTime
      ? [...sampleTimes, curve.eventTime - 1e-6, curve.eventTime].sort((a, b) => a - b)
      : sampleTimes;
    for (const [index, time] of times.entries()) {
      const ordinate = y(curve.value(time, curve.settings.value, curve.settings.parameters));
      if (index === 0) context.moveTo(x(time), ordinate);
      else context.lineTo(x(time), ordinate);
    }
    context.stroke();
  }
  if (timeMarker !== undefined) {
    const cursor = x(timeMarker);
    context.strokeStyle = "#675679";
    context.setLineDash([3, 3]);
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(cursor, bounds.top);
    context.lineTo(cursor, bounds.bottom);
    context.stroke();
    for (const curve of model.companion || model.series ? curves : curves.slice(1)) {
      const value = curve.value === model.value ? state : curve.value(timeMarker, selected.value, selected.parameters);
      context.fillStyle = curve.color;
      context.beginPath();
      context.arc(cursor, y(value), 4, 0, 2 * Math.PI);
      context.fill();
    }
  }
}
