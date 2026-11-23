import {
  frameStep, impulseResponse, inputForce, pendulumAcceleration, roadHeight, signalFields, suspensionFields
} from "./activity-models.js";

import { ink, muted, grid, purple, orange, green, surface, stroke, dot, spring, dashpot, arrow, pretty, text } from "./simulation-drawing.js";
import { drawLabMotion } from "./lab-motion.js";

const cartCoil = { turns: 5, radius: 4 };

function numericLabel(value, span) {
  const digits = span >= 20 ? 0 : span >= 2 ? 1 : span >= .2 ? 2 : 3;
  return Number(value.toFixed(digits)).toString();
}

const plotBounds = (width, height) => ({ left: 50, right: width - 15, top: 25, bottom: height - 38 });

function plot(surface, range, labels, { equalScale = false, square = false } = {}) {
  const { ctx, width, height } = surface;
  let { left, right, top, bottom } = plotBounds(width, height);
  if (square) {
    const side = Math.min(right - left, bottom - top);
    left += (right - left - side) / 2;
    top += (bottom - top - side) / 2;
    right = left + side;
    bottom = top + side;
  }
  let [minX, maxX, minY, maxY] = range;
  if (equalScale) {
    const xMid = (minX + maxX) / 2;
    const yMid = (minY + maxY) / 2;
    const pixelsPerUnit = Math.min((right - left) / (maxX - minX), (bottom - top) / (maxY - minY));
    const halfWidth = (right - left) / pixelsPerUnit / 2;
    const halfHeight = (bottom - top) / pixelsPerUnit / 2;
    [minX, maxX, minY, maxY] = [xMid - halfWidth, xMid + halfWidth, yMid - halfHeight, yMid + halfHeight];
  }

  const x = (value) => left + (value - minX) / (maxX - minX) * (right - left);
  const y = (value) => bottom - (value - minY) / (maxY - minY) * (bottom - top);

  const xSpan = maxX - minX;
  const ySpan = maxY - minY;
  for (let i = 0; i <= 4; i += 1) {
    const xValue = minX + xSpan * i / 4;
    const yValue = minY + ySpan * i / 4;
    const px = x(xValue), py = y(yValue);
    stroke(ctx, [[px, top], [px, bottom], null, [left, py], [right, py]], grid, 1);
    ctx.fillStyle = muted;
    ctx.textAlign = "center";
    ctx.fillText(numericLabel(xValue, xSpan), px, bottom + 15);
    ctx.textAlign = "right";
    ctx.fillText(numericLabel(yValue, ySpan), left - 7, py + 4);
  }
  if (minY < 0 && maxY > 0) stroke(ctx, [[left, y(0)], [right, y(0)]], "#cfc3d8", 1);
  stroke(ctx, [[left, top], [left, bottom], [right, bottom]], "#cfc3d8", 1);
  ctx.fillStyle = muted;
  ctx.textAlign = "left";
  ctx.fillText(labels[1], left, 15);
  ctx.textAlign = "center";
  ctx.fillText(labels[0], (left + right) / 2, height - 5);

  function clip(draw) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, right - left + 1, bottom - top + 1);
    ctx.clip();
    draw();
    ctx.restore();
  }

  function line(points, color, width, dash) {
    clip(() => stroke(ctx, points.map((point) => point && [x(point[0]), y(point[1])]), color, width, dash));
  }

  function marker(atX, atY, color) {
    clip(() => dot(ctx, x(atX), y(atY), 4, color, "#fff"));
  }

  function cursor(time) {
    clip(() => stroke(ctx, [[x(time), top], [x(time), bottom]], "#7b6b84", 1, [4, 4]));
  }

  return { x, y, clip, line, marker, cursor };
}

function extent(sources, minimum = 0, padding = .13) {
  const values = sources.flat();
  const lower = Math.min(0, ...values);
  const upper = Math.max(0, ...values);
  const spread = Math.max(minimum, upper - lower, 1e-4);
  return [lower - padding * spread, upper + padding * spread];
}

function timePlot(surface, duration, frame, channels, label, fixedRange, xLabel = "Time (s)") {
  const range = fixedRange || extent(channels.map(({ values }) => values));
  const chart = plot(surface, [0, duration, ...range], [xLabel, label]);
  for (const { values, color, dash, wrap } of channels) {
    const points = [];
    values.forEach((value, index) => {
      if (wrap && index > 0 && Math.abs(value - values[index - 1]) > Math.PI) points.push(null);
      points.push([index * frameStep, value]);
    });
    chart.line(points, color, 2, dash);
  }
  const time = frame * frameStep;
  chart.cursor(time);
  for (const { values, color } of channels) chart.marker(time, values[frame], color);
}

function forcePlot(surface, simulation, frame, xLabel = "Time (s)") {
  const time = frame * frameStep;
  const duration = (simulation.frames.length - 1) * frameStep;
  if (simulation.profile.idealImpulse) {
    const { ctx, width, height } = surface;
    const { left, right, bottom: baseline } = plotBounds(width, height);
    const tip = 40;
    const cursor = left + (right - left) * time / duration;
    stroke(ctx, [[left, baseline], [right, baseline]], grid);
    stroke(ctx, [[cursor, tip - 7], [cursor, baseline]], "#9a899f", 1, [4, 5]);
    stroke(ctx, [[left, baseline], [left, tip], null, [left - 5, tip + 8], [left, tip], [left + 5, tip + 8]], purple, 2.5);
    ctx.fillStyle = ink;
    ctx.textAlign = "left";
    ctx.fillText("1 N·s at t = 0 (symbolic)", left + 11, tip + 4);
    ctx.textAlign = "center";
    for (let tick = 0; tick <= 4; tick++) {
      ctx.fillText(numericLabel(duration * tick / 4, duration), left + (right - left) * tick / 4, baseline + 15);
    }
    ctx.fillText(xLabel, (left + right) / 2, height - 5);
    return;
  }
  const { width, amplitude } = simulation.profile;
  const chart = plot(surface, [0, duration, 0, amplitude * 1.1], [xLabel, "Force (N)"]);
  const points = width < duration
    ? [[0, amplitude], [width, amplitude], [width, 0], [duration, 0]]
    : [[0, amplitude], [duration, amplitude]];
  chart.line(points, purple, 2);
  chart.cursor(time);
  chart.marker(time, inputForce(time, simulation.profile), purple);
}

function oscillatorMotion({ ctx, width, height }, state, impulse, displacementScale = 1) {
  const middle = height * .56;
  const equilibrium = width * .50;
  const rest = Math.min(164, equilibrium - 50);
  const center = equilibrium + rest * 1.45 * displacementScale * state.position;
  const wall = equilibrium - 28 - rest;
  const start = center - 28;
  stroke(ctx, [[wall, middle - 40], [wall, middle + 28], [width - 15, middle + 28]], grid, 3);
  spring(ctx, wall, middle - 13, start, middle - 13, purple, cartCoil);
  dashpot(ctx, wall, middle + 13, start, middle + 13, green, rest);
  ctx.fillStyle = purple;
  ctx.fillRect(start, middle - 26, 56, 52);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("1 kg", center, middle + 4);
  const origin = center + 30;
  const end = Math.min(width - 10, origin + 36 + 22 * Math.tanh(state.force / 3));
  if (state.force > 0 || impulse) arrow(ctx, origin, middle, end - origin, 0, orange);
  const forceLabel = impulse ? "J = 1.00 N·s" : `F = ${pretty(state.force)} N`;
  const labelX = Math.min(width - 10, Math.max(end, center + 62));
  text(ctx, forceLabel, labelX, middle - 32, state.force > 0 || impulse ? orange : muted, "right", 14);
}

const phaseRange = [-3.3, 3.3, -8, 8];

export function phaseInitialCondition(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const px = clientX - rect.left, py = clientY - rect.top;
  const { left, right, top, bottom } = plotBounds(rect.width, rect.height);
  if (px < left || px > right || py < top || py > bottom) return null;
  const [angleMin, angleMax, speedMin, speedMax] = phaseRange;
  return [
    angleMin + (px - left) / (right - left) * (angleMax - angleMin),
    speedMin + (bottom - py) / (bottom - top) * (speedMax - speedMin)
  ];
}

function pendulumMotion({ ctx, width, height }, state, showLinear) {
  const originX = width / 2, originY = height * .45;
  const length = Math.min(width * .32, height * .37);
  stroke(ctx, [[originX - 30, originY - 9], [originX + 30, originY - 9]], grid, 3);
  stroke(ctx, [[originX, originY - length], [originX, originY + length]], grid, 1, [4, 5]);

  if (showLinear) {
    const end = [originX + length * Math.sin(state.linearAngle), originY + length * Math.cos(state.linearAngle)];
    stroke(ctx, [[originX, originY], end], green, 2.5, [5, 5]);
    dot(ctx, ...end, 10, "#fff", green);
  }
  const end = [originX + length * Math.sin(state.angle), originY + length * Math.cos(state.angle)];
  stroke(ctx, [[originX, originY], end], purple, 3);
  dot(ctx, ...end, 10, purple);
  dot(ctx, originX, originY, 4, ink);
}

function phasePortrait(surface, simulation, frame) {
  const { ctx } = surface;
  const chart = plot(surface, phaseRange, ["Angle θ (rad)", "Angular velocity (rad/s)"]);
  chart.clip(() => {
    for (let col = 1; col < 12; col += 1) {
      for (let row = 1; row < 8; row += 1) {
        const angle = phaseRange[0] + (phaseRange[1] - phaseRange[0]) * col / 12;
        const velocity = phaseRange[2] + (phaseRange[3] - phaseRange[2]) * row / 8;
        const px = chart.x(angle), py = chart.y(velocity);
        const dx = chart.x(angle + velocity) - px;
        const dy = chart.y(velocity + pendulumAcceleration(angle, velocity)) - py;
        const size = Math.hypot(dx, dy);
        if (size < 1e-5) continue;
        const fx = dx * 6 / size, fy = dy * 6 / size;
        const endX = px + fx, endY = py + fy;
        stroke(ctx, [
          [px - fx, py - fy], [endX, endY], null,
          [endX - .65 * fx + .45 * fy, endY - .65 * fy - .45 * fx], [endX, endY],
          [endX - .65 * fx - .45 * fy, endY - .65 * fy + .45 * fx]
        ], "#b2a6bc", .9);
      }
    }
    dot(ctx, chart.x(0), chart.y(0), 3.5, ink);
    dot(ctx, chart.x(-Math.PI), chart.y(0), 3.5, "#fff", ink);
    dot(ctx, chart.x(Math.PI), chart.y(0), 3.5, "#fff", ink);
  });

  const trail = [];
  for (let index = 0; index <= frame; index += 1) {
    const state = simulation.frames[index];
    if (index > 0 && Math.abs(state.angle - simulation.frames[index - 1].angle) > Math.PI) trail.push(null);
    trail.push([state.angle, state.velocity]);
  }
  if (simulation.showLinear) {
    chart.line(simulation.frames.slice(0, frame + 1).map((state) => [state.linearAngle, state.linearVelocity]), green, 1.6, [5, 4]);
  }
  chart.line(trail, purple, 2.3);
  const current = simulation.frames[frame];
  chart.marker(current.angle, current.velocity, purple);
}

function coupledMotion({ ctx, width, height }, state) {
  const y = height * .53;
  const span = Math.min(440, width - 34);
  const left = (width - span) / 2, right = left + span;
  const half = Math.min(19, span * .065);
  const rest = (span - 4 * half) / 3;
  const scale = 1.85 * rest;
  const first = left + rest + half + state.first * scale;
  const second = right - rest - half + state.second * scale;
  const floor = y + 24;
  stroke(ctx, [[left, floor], [right, floor]], grid, 3);
  for (const x of [left, right]) stroke(ctx, [[x, y - 35], [x, floor]], ink, 2);
  spring(ctx, left, y, first - half, y, muted, cartCoil);
  spring(ctx, first + half, y, second - half, y, green, cartCoil);
  spring(ctx, second + half, y, right, y, muted, cartCoil);
  for (const [x, color, text] of [[first, purple, "1"], [second, orange, "2"]]) {
    ctx.fillStyle = color;
    ctx.fillRect(x - half, y - 17, 2 * half, 34);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 4);
  }
}

function suspensionMotion({ ctx, width, height }, state, time) {
  const center = width / 2;
  const road = height * .85;
  const suspensionRest = height * .34 - 20;
  const scale = suspensionRest * 4.6;
  const body = height * .31 - scale * state.body;
  const wheel = height * .65 - scale * state.wheel;
  const roadPoints = Array.from({ length: 160 }, (_, i) => {
    const x = 10 + (width - 20) * i / 159;
    return [x, road - scale * roadHeight(time + (x - center) * .55 / width)];
  });
  stroke(ctx, roadPoints, "#595362", 3);
  spring(ctx, center - 22, body + 14, center - 22, wheel - 10, purple, { turns: 4 });
  dashpot(ctx, center + 22, body + 14, center + 22, wheel - 10, green, suspensionRest - 4);
  stroke(ctx, [[center - 30, wheel - 10], [center + 30, wheel - 10]], muted, 1.5);
  spring(ctx, center, wheel + 9, center, road - scale * roadHeight(time), orange, { turns: 3 });
  ctx.fillStyle = purple;
  ctx.fillRect(center - 48, body - 15, 96, 29);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Body", center, body + 4);
  dot(ctx, center, wheel, 12, orange);
  ctx.fillStyle = muted;
  ctx.textAlign = "left";
  ctx.fillText("Wheel", center + 18, wheel + 4);
  ctx.fillStyle = green;
  ctx.fillText("Damper", center + 34, (body + wheel) / 2);
  ctx.fillStyle = purple;
  ctx.textAlign = "right";
  ctx.fillText("Spring", center - 34, (body + wheel) / 2);
}

function vehiclePaths(surface, simulation, frame) {
  const { ctx } = surface;
  const states = simulation.frames;
  const xValues = states.flatMap(({ x, referenceX }) => [x, referenceX]);
  const yValues = states.flatMap(({ y, referenceY }) => [y, referenceY]);
  const chart = plot(surface, [...extent([xValues], 10, .07), ...extent([yValues], 18, .07)], ["X (m)", "Y (m)"], { equalScale: true });
  chart.line(states.map(({ referenceX, referenceY }) => [referenceX, referenceY]), green, 1.8, [6, 4]);
  chart.line(states.map(({ x, y }) => [x, y]), "#d4c5e2", 1.7);
  chart.line(states.slice(0, frame + 1).map(({ x, y }) => [x, y]), purple, 2.5);
  const state = states[frame];
  chart.marker(state.referenceX, state.referenceY, green);
  chart.clip(() => {
    ctx.save();
    ctx.translate(chart.x(state.x), chart.y(state.y));
    ctx.rotate(-state.heading);
    ctx.fillStyle = purple;
    ctx.fillRect(-8, -4, 16, 8);
    ctx.fillStyle = "#fff";
    ctx.fillRect(2, -3, 2, 6);
    ctx.restore();
  });
}

function vehiclePhase(surface, simulation, frame) {
  const points = simulation.frames.map(({ velocityDifference, rateDifference }) => [velocityDifference, rateDifference]);
  const chart = plot(surface, [-1.5, 1.5, -.32, .32], ["Δ lateral velocity (m/s)", "Δ yaw rate (rad/s)"]);
  chart.line(points, "#d4c5e2", 1.7);
  chart.line(points.slice(0, frame + 1), purple, 2.3);
  chart.marker(0, 0, ink);
  chart.marker(...points[frame], purple);
}

function convolutionOverlap(surface, simulation, frame, view) {
  const time = frame * frameStep;
  const duration = (simulation.frames.length - 1) * frameStep;
  const points = Array.from({ length: 401 }, (_, i) => i * duration / 400);
  const shifted = points.map((tau) => [tau, impulseResponse(time - tau)]);
  const xLabel = "Past time τ (s)";
  const range = .22 * simulation.profile.amplitude;
  if (view === "kernel") {
    const chart = plot(surface, [0, duration, -.22, .22], [xLabel, "h(t−τ) (m/(N·s))"]);
    chart.line(shifted, green, 2, [5, 3]);
    chart.cursor(time);
    return;
  }
  const chart = plot(surface, [0, duration, -range, range], [xLabel, "F(τ) h(t−τ) (m/s)"]);
  const product = shifted.map(([tau, kernel]) => [tau, inputForce(tau, simulation.profile) * kernel]);
  const { ctx } = surface;
  chart.clip(() => {
    for (const [side, color] of [[1, "rgba(204, 96, 32, .34)"], [-1, "rgba(23, 100, 84, .29)"]]) {
      ctx.beginPath();
      ctx.moveTo(chart.x(0), chart.y(0));
      for (const [tau, value] of product) ctx.lineTo(chart.x(tau), chart.y(side * Math.max(0, side * value)));
      ctx.lineTo(chart.x(duration), chart.y(0));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  });
  chart.line(product, muted, 1.4);
  chart.cursor(time);
}

const series = (frames, key, color, dash, wrap = false) => ({ values: frames.map((state) => state[key]), color, dash, wrap });

export function renderActivityView(canvas, activity, view, simulation, frame, signal, reduction = 0) {
  if (view === "physical") {
    drawLabMotion(canvas, activity, simulation.frames[frame]);
    return;
  }
  const drawing = surface(canvas);
  if (!drawing) return;
  const duration = (simulation.frames.length - 1) * frameStep;
  const sample = simulation.frames[frame];
  const time = frame * frameStep;

  switch (activity) {
    case "tap-sum":
      timePlot(drawing, duration, frame, [
        series(simulation.frames, "first", purple),
        series(simulation.frames, "second", green, [6, 4]),
        series(simulation.frames, "position", orange, [2, 4])
      ], "Displacement (m)");
      break;
    case "representations":
      if (view === "motion") oscillatorMotion(drawing, sample, false, .19);
      else if (view === "phase") {
        const chart = plot(drawing, [-.4, 1.2, -1.5, .5], ["Position (m)", "Velocity (m/s)"], { square: true });
        chart.line(simulation.frames.map(s => [s.position, s.velocity]), purple, 2);
        chart.marker(sample.position, sample.velocity, orange);
      } else timePlot(drawing, duration, frame, [series(simulation.frames, "position", purple)], "Displacement (m)");
      break;
    case "base-response":
      if (view === "ratio") {
        const chart = plot(drawing, [0, 4, 0, 4], ["Frequency ratio", "Amplitude ratio"]);
        chart.line([[0, 1], [4, 1]], green, 1.5, [6, 4]);
        chart.line(simulation.curve, purple, 2);
        chart.marker(simulation.ratio, simulation.gain, orange);
      } else timePlot(drawing, duration, frame, [
        series(simulation.frames, "machine", purple),
        series(simulation.frames, "floor", green, [6, 4])
      ], "Displacement (mm)", [-40, 40]);
      break;
    case "pendulum":
      if (view === "motion") {
        pendulumMotion(drawing, sample, simulation.showLinear);
      } else if (view === "phase") {
        phasePortrait(drawing, simulation, frame);
      } else {
        const channels = [series(simulation.frames, "angle", purple, [], true)];
        if (simulation.showLinear) channels.push(series(simulation.frames, "linearAngle", green, [5, 4]));
        timePlot(drawing, duration, frame, channels, "Angle (rad)", [-3.4, 3.4]);
      }
      break;
    case "step-impulse":
      if (view === "motion") oscillatorMotion(drawing, sample, simulation.profile.idealImpulse && frame === 0);
      else if (view === "force") forcePlot(drawing, simulation, frame);
      else {
        const channels = [series(simulation.frames, "position", purple)];
        if (simulation.profile.amplitude > 1) {
          channels.push({ values: simulation.frames.map((_, i) => impulseResponse(i * frameStep)), color: green, dash: [5, 4] });
        }
        timePlot(drawing, duration, frame, channels, "Displacement (m)", [-.13, .2]);
      }
      break;
    case "signal-flow": {
      if (view === "motion") {
        oscillatorMotion(drawing, sample, false);
        break;
      }
      if (view === "force") {
        forcePlot(drawing, simulation, frame);
        break;
      }
      if (reduction > 0 && signal === "position") {
        timePlot(drawing, duration, frame, [
          { values: simulation.integrated, color: purple },
          series(simulation.frames, "position", green, [5, 4])
        ], "Displacement (m)");
        break;
      }
      const [label, unit] = signalFields[signal];
      timePlot(drawing, duration, frame, [series(simulation.frames, signal, purple)], label + " (" + unit + ")");
      break;
    }
    case "convolution":
      if (view === "motion") oscillatorMotion(drawing, { position: sample.output, force: sample.input }, false);
      else if (view === "force") forcePlot(drawing, simulation, frame, "Past time τ (s)");
      else if (view === "kernel" || view === "overlap") convolutionOverlap(drawing, simulation, frame, view);
      else timePlot(drawing, duration, frame, [series(simulation.frames, "output", orange)],
        "Displacement x(t) (m)", [-.13, .2], "Observation time t (s)");
      break;
    case "modes":
      if (view === "motion") coupledMotion(drawing, sample);
      else timePlot(drawing, duration, frame, [
        series(simulation.frames, "first", purple),
        series(simulation.frames, "second", orange, [6, 4])
      ], "Displacement (m)", [-.11, .11]);
      break;
    case "viscous-damper": {
      const power = view === "power";
      timePlot(drawing, duration, frame,
        [series(simulation.frames, power ? "dissipatedPower" : "velocity", power ? green : purple)],
        power ? "Power dissipated (W)" : "Velocity (m/s)", power ? [0, 4.2] : [0, 2.1]);
      break;
    }
    case "quarter-car":
      if (view === "motion") {
        suspensionMotion(drawing, sample, time);
      } else {
        const [label, unit] = suspensionFields[simulation.metric];
        timePlot(drawing, duration, frame, [
          series(simulation.comparison.light, simulation.metric, purple),
          series(simulation.comparison.firm, simulation.metric, orange, [6, 4])
        ], label + " (" + unit + ")");
      }
      break;
    case "vehicle":
      if (view === "path") vehiclePaths(drawing, simulation, frame);
      else vehiclePhase(drawing, simulation, frame);
      break;
  }
}
