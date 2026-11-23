import { arrow, box, dot, green, ink, muted, opacity, orange, pretty, purple, resistor, stroke, text } from "./simulation-drawing.js";

const blue = "#2d668a";
const softBlue = "#e8f4fb";
const warm = "#b8373e";

function digitalMeter(ctx, x, y, symbol, reading, color) {
  box(ctx, x, y, 106, 30, "#f6f8fa", "#9a9aa9");
  box(ctx, x + 5, y + 5, 22, 20, "#fff", color);
  text(ctx, symbol, x + 16, y + 20, color, "center", 13);
  box(ctx, x + 32, y + 5, 69, 20, color === blue ? softBlue : "#fff2e9", "#ddd5df");
  text(ctx, reading, x + 96, y + 20, ink, "right", 13);
}

function chargeMarkers(ctx, points, phase) {
  const pitch = 19;
  let offset = ((phase * pitch) % pitch + pitch) % pitch;
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index - 1], [nextX, nextY] = points[index];
    const distance = Math.hypot(nextX - x, nextY - y);
    for (; offset < distance; offset += pitch) {
      const fraction = offset / distance;
      dot(ctx, x + fraction * (nextX - x), y + fraction * (nextY - y), 2.9, "#147ac2", "#fff");
    }
    offset -= distance;
  }
}

function conductor(ctx, points, phase) {
  stroke(ctx, points, ink, 1.7);
  chargeMarkers(ctx, points, phase);
}

function capacitor(ctx, x, y) {
  stroke(ctx, [[x - 15, y - 5], [x + 15, y - 5], null, [x - 15, y + 5], [x + 15, y + 5]], purple, 2.4);
}

function horizontalCoil(ctx, x, y, radius) {
  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.arc(x + (2 * index + 1) * radius, y, radius, Math.PI, 0);
    ctx.strokeStyle = green;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
}

export function circuit(ctx, { voltage, current, currentUnit, charge }, kind) {
  const left = 46, right = 258, top = 43, bottom = 133;
  const phase = charge / (kind === "rc" ? .55 : .75);
  conductor(ctx, [[left, 73], [left, top], [84, top]], phase);
  resistor(ctx, 84, top, 137, top, purple, 5);
  text(ctx, "R", 110, 27, purple);
  if (kind === "rlc") {
    conductor(ctx, [[137, top], [172, top]], phase);
    horizontalCoil(ctx, 172, top, 7);
    conductor(ctx, [[228, top], [right, top], [right, 82]], phase);
    text(ctx, "L", 200, 27, green);
  } else {
    conductor(ctx, [[137, top], [right, top], [right, kind === "rl" ? 65 : 82]], phase);
  }
  if (kind === "rl") {
    ctx.save();
    ctx.translate(right, 65);
    ctx.rotate(Math.PI / 2);
    horizontalCoil(ctx, 0, 0, 5.5);
    ctx.restore();
  } else {
    capacitor(ctx, right, 87);
  }
  text(ctx, kind === "rl" ? "L" : "C", right - 24, 92, kind === "rl" ? green : purple);
  conductor(ctx, [[right, kind === "rl" ? 109 : 92], [right, bottom], [207, bottom]], phase);
  conductor(ctx, [[101, bottom], [left, bottom], [left, 103]], phase);
  dot(ctx, left, 88, 15, "#fff", ink);
  text(ctx, "+", left, 85, ink, "center", 12);
  text(ctx, "−", left, 97, ink, "center", 12);
  text(ctx, "5 V", 16, 93, muted, "center", 12);
  digitalMeter(ctx, 101, 118, "A", `${pretty(current)} ${currentUnit}`, orange);

  stroke(ctx, [[right, 58], [329, 58], [329, 72], null, [right, 115], [329, 115], [329, 102]], blue, 1.35);
  dot(ctx, right, 58, 2.6, blue);
  dot(ctx, right, 115, 2.6, blue);
  digitalMeter(ctx, 276, 72, "V", `${pretty(voltage)} V`, blue);
  return `Current ${pretty(current)} ${currentUnit} · ${kind === "rl" ? "Inductor" : "Capacitor"} voltage ${pretty(voltage)} V`;
}

export function ladder(ctx, { first, second, current }) {
  const top = 52, bottom = 119, sourceX = 28, sourceY = 85, sourceRadius = 14;
  const inputPhase = (first + second) / .40, linkPhase = second / .28;
  text(ctx, "5 V step", sourceX, 34, muted, "center", 13);
  conductor(ctx, [[sourceX, sourceY - sourceRadius], [sourceX, top], [49, top]], inputPhase);
  resistor(ctx, 49, top, 87, top, purple, 5);
  conductor(ctx, [[87, top], [105, top]], inputPhase);
  conductor(ctx, [[105, top], [128, top]], linkPhase);
  resistor(ctx, 128, top, 174, top, purple, 5);
  conductor(ctx, [[174, top], [212, top], [212, 79]], linkPhase);
  text(ctx, "R₁", 69, 34, purple);
  text(ctx, "R₂", 151, 34, purple);
  for (const [x, phase, node] of [[105, first / .28, "1"], [212, linkPhase, "2"]]) {
    if (node === "1") conductor(ctx, [[x, top], [x, 79]], phase);
    capacitor(ctx, x, 84);
    conductor(ctx, [[x, 89], [x, bottom]], phase);
    dot(ctx, x, top, 3.3, blue);
    text(ctx, `Node ${node}`, x, 141, blue);
  }
  conductor(ctx, [[212, bottom], [105, bottom]], linkPhase);
  conductor(ctx, [[105, bottom], [sourceX, bottom], [sourceX, sourceY + sourceRadius]], inputPhase);
  dot(ctx, sourceX, sourceY, sourceRadius, "#fff", ink);
  text(ctx, "+", sourceX, 82, ink, "center", 13);
  text(ctx, "−", sourceX, 94, ink, "center", 13);
  stroke(ctx, [[sourceX, bottom], [sourceX, 127], null, [sourceX - 9, 127], [sourceX + 9, 127],
    null, [sourceX - 6, 131], [sourceX + 6, 131], null, [sourceX - 3, 135], [sourceX + 3, 135]], ink, 1.4);
  text(ctx, "0 V", sourceX, 149, muted, "center", 12);
  digitalMeter(ctx, 267, 17, "V₁", `${pretty(first)} V`, blue);
  digitalMeter(ctx, 267, 62, "V₂", `${pretty(second)} V`, blue);
  digitalMeter(ctx, 267, 107, "A₁₂", `${pretty(current)} mA`, orange);
  return `Node 1 ${pretty(first)} V · Node 2 ${pretty(second)} V · Between nodes ${pretty(current)} mA`;
}

function temperatureColor(temperature, shades) {
  const [cool, neutral, hot] = shades;
  const [from, to, fraction] = temperature <= 40
    ? [cool, neutral, opacity((temperature - 20) / 20)]
    : [neutral, hot, opacity((temperature - 40) / 20)];
  return `rgb(${from.map((base, index) => Math.round(base + fraction * (to[index] - base))).join(" ")})`;
}

function thermalBody(ctx, x, gauge, title, temperature) {
  const color = temperatureColor(temperature, [[31, 102, 170], [105, 90, 123], [185, 45, 51]]);
  const fill = temperatureColor(temperature, [[204, 230, 255], [248, 247, 251], [255, 179, 174]]);
  box(ctx, x, 39, 80, 72, fill, color);
  box(ctx, gauge - 5, 42, 10, 52, "#fff", color);
  const height = 48 * opacity((temperature - 20) / 40);
  ctx.fillStyle = color;
  ctx.fillRect(gauge - 3, 92 - height, 6, height);
  dot(ctx, gauge, 98, 8, color, "#fff");
  stroke(ctx, [[gauge + 6, 44], [gauge + 11, 44], null, [gauge + 6, 68], [gauge + 11, 68],
    null, [gauge + 6, 92], [gauge + 11, 92]], color, 1.2);
  text(ctx, title, x + 40, 65, ink, "center", 13);
  text(ctx, `${pretty(temperature, 1)} °C`, x + 40, 88, color, "center", 17);
}

export function heat(ctx, { temperature, input, loss, first, second }) {
  const pair = first !== undefined;
  thermalBody(ctx, 88, 69, pair ? "Body 1" : "Heated body", pair ? first : temperature);
  thermalBody(ctx, 235, 334, pair ? "Body 2" : "Room", pair ? second : 20);
  if (!pair) {
    stroke(ctx, [[66, 122], [121, 122]], orange);
    arrow(ctx, 121, 122, 0, -11, orange);
    text(ctx, "50 W", 44, 126, orange, "center", 13);
  }
  resistor(ctx, 168, 75, 235, 75, purple, 6);
  text(ctx, pair ? "R₁₂" : "Rₜₕ", 201, 58, purple);
  arrow(ctx, 173, 101, 57 * Math.tanh(loss / 55), 0, orange);
  text(ctx, "Thermometer scale 20–60 °C", 201, 145, muted, "center", 15);
  return pair
    ? `Body 1 ${pretty(first, 1)} °C · Body 2 ${pretty(second, 1)} °C · Heat transfer ${pretty(loss, 1)} W`
    : `Body ${pretty(temperature, 1)} °C · Heat loss ${pretty(loss, 1)} W · Net heat input ${pretty(input - loss, 1)} W`;
}

function magneticCouple(ctx, { angle, field, force, forceScale }, angleScale = 1) {
  const center = 118, middle = 81;
  text(ctx, `B = ${pretty(field)} T`, center, 19, blue, "center", 16);
  for (const y of [40, 120]) arrow(ctx, 46, y, 145, 0, "#7aa6c1");
  box(ctx, 18, 61, 27, 42, softBlue, blue);
  box(ctx, 192, 61, 27, 42, "#fff0f0", warm);
  text(ctx, "N", 31, 88, blue);
  text(ctx, "S", 205, 88, warm);
  dot(ctx, center, middle, 32, "#f3eef7", purple);
  if (angleScale !== 1) stroke(ctx, [[center, middle], [center + 30, middle]], muted, 1.5, [3, 3]);
  const displayAngle = angle * angleScale;
  const mark = [center + 23 * Math.cos(displayAngle), middle - 23 * Math.sin(displayAngle)];
  stroke(ctx, [[center, middle], mark], purple, 3);
  dot(ctx, ...mark, 4.7, purple);
  const length = 34 * Math.tanh(force / forceScale);
  for (const side of [-1, 1]) {
    const x = center + side * 49;
    dot(ctx, x, middle, 7, "#fff", orange);
    if (side === 1) dot(ctx, x, middle, 2.6, orange);
    else stroke(ctx, [[x - 3, middle - 3], [x + 3, middle + 3], null,
      [x - 3, middle + 3], [x + 3, middle - 3]], orange, 1.5);
    arrow(ctx, x, middle - side * 10, 0, -side * length, orange);
  }
  if (angleScale === 1) text(ctx, "Winding forces", center, 145, orange, "center", 14);
  else text(ctx, `Rotor angle ×${angleScale}`, center, 145, purple, "center", 14);
}

function dial(ctx, value, maximum, label, unit, target) {
  const x = 303, y = 103, radius = 57;
  const start = -Math.PI * .85, sweep = .70 * Math.PI;
  ctx.beginPath();
  ctx.arc(x, y, radius, start, start + sweep);
  ctx.strokeStyle = purple;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  for (let tick = 0; tick <= 4; tick += 1) {
    const angle = start + sweep * tick / 4;
    stroke(ctx, [[x + 49 * Math.cos(angle), y + 49 * Math.sin(angle)],
      [x + radius * Math.cos(angle), y + radius * Math.sin(angle)]], purple, 1.5);
  }
  if (target !== undefined) {
    const targetAngle = start + sweep * opacity(target / maximum);
    stroke(ctx, [[x, y], [x + (radius + 6) * Math.cos(targetAngle), y + (radius + 6) * Math.sin(targetAngle)]],
      "#8a639f", 2, [5, 3]);
    text(ctx, "Target " + pretty(target, 2) + unit, x, 19, purple);
  }
  const angle = start + sweep * opacity(value / maximum);
  arrow(ctx, x, y, 45 * Math.cos(angle), 45 * Math.sin(angle), orange);
  dot(ctx, x, y, 3.7, ink);
  text(ctx, "0", 250, 88, muted, "center", 12);
  text(ctx, String(maximum), 355, 88, muted, "center", 12);
  text(ctx, label, x, 124, purple);
  text(ctx, pretty(value, 2) + (unit === "°" ? "" : " ") + unit, x, 144, ink, "center", 16);
}

export function motor(ctx, state) {
  magneticCouple(ctx, state);
  dial(ctx, state.speed, 20, "Shaft speed", "rad/s");
}

export function galvanometer(ctx, state) {
  magneticCouple(ctx, state, 16);
  dial(ctx, state.pointerAngle, 8, "Pointer angle", "°", state.targetAngle);
}
