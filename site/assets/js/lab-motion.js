import { dashpot, dot, green, ink, muted, orange, purple, spring, stroke, surface, text, box, arrow, pretty, opacity } from "./simulation-drawing.js";
import { circuit, heat, ladder, motor, galvanometer } from "./lab-instruments.js";

const blue = "#2d668a";
const water = "#a9d8f6";
const softPurple = "#f0e8f8";

function mechanical(ctx, { position, travel, reference, gain, force }) {
  const zero = reference === undefined ? 242 : 212;
  const rest = zero - 32 - 53;
  const scale = .32 * rest / travel;
  const x = zero + scale * position;
  const left = x - 32;
  stroke(ctx, [[53, 105], [368, 105], null, [53, 38], [53, 105]], muted);
  stroke(ctx, [[zero, 109], [zero, 125]], muted, 1.4);
  text(ctx, reference === undefined ? "Equilibrium" : "0 m", zero, 143, muted,
    reference === undefined ? "center" : "right");
  if (reference !== undefined) {
    const target = zero + scale * reference;
    stroke(ctx, [[target, 34], [target, 125]], purple, 1, [4, 4]);
    text(ctx, "1 m target", target, 143, purple, "left");
  }
  spring(ctx, 53, 59, left, 59, purple);
  dashpot(ctx, 53, 86, left, 86, green, rest);
  box(ctx, left, 42, 64, 63, softPurple, purple);
  text(ctx, "Mass", x, 79, purple);
  text(ctx, "Spring", 80, 43, purple);
  text(ctx, "Damper", 80, 78, green);
  if (reference === undefined) return `Position ${pretty(position, 3)} m`;

  // The actuator acts at the same point on the cart for either force direction.
  const signedForce = (force >= .05 ? "+" : "") + pretty(force, 1) + " N";
  if (Math.abs(force) >= .05) {
    const length = 8 + 52 * Math.tanh(Math.abs(force) / 30);
    arrow(ctx, x, 52, Math.sign(force) * length, 0, orange);
  }
  dot(ctx, x, 52, 3, orange);
  text(ctx, "Controller force " + signedForce, x, 24, orange);
  return `Position ${pretty(position, 3)} m · Error (target − position) ${pretty(reference - position, 3)} m · Gain Kₚ ${gain} N/m · Controller force ${signedForce}`;
}

function openTank(ctx, x, top, right, bottom, fraction, concentration = 0) {
  const fill = (bottom - top) * fraction;
  const surfaceY = bottom - fill;
  if (fill > 0) {
    ctx.fillStyle = water;
    ctx.fillRect(x, surfaceY, right - x, fill);
    if (concentration > 0) {
      ctx.fillStyle = `rgb(63 119 159 / ${opacity(concentration) * .75})`;
      ctx.fillRect(x, surfaceY, right - x, fill);
    }
  }
  stroke(ctx, [[x, top], [x, bottom], [right, bottom], [right, top]], ink);
  if (fill > 0) stroke(ctx, [[x, surfaceY], [right, surfaceY]], blue);
  return surfaceY;
}

function waterStream(ctx, points, flow, volume, [arrowX, arrowY, arrowLength]) {
  if (flow < .001) return;
  const pitch = 14;
  let offset = ((volume * 30) % pitch + pitch) % pitch;
  stroke(ctx, points, "#4a9ad3", 1.5 + 2 * Math.tanh(flow / .3));
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index - 1], [nextX, nextY] = points[index];
    const distance = Math.hypot(nextX - x, nextY - y);
    for (; offset < distance; offset += pitch) {
      const fraction = offset / distance;
      dot(ctx, x + (nextX - x) * fraction, y + (nextY - y) * fraction, 2.5, "#1268a4", "#d9f0ff");
    }
    offset -= distance;
  }
  arrow(ctx, arrowX, arrowY, arrowLength, 0, blue);
}

function drain(ctx, { level, outflow, drained }) {
  const x = 105, bottom = 132, right = 249;
  const surfaceY = openTank(ctx, x, 22, right, bottom, level / .70);
  if (bottom - surfaceY > 11) {
    stroke(ctx, [[x - 21, surfaceY], [x - 13, surfaceY], null,
      [x - 17, surfaceY], [x - 17, bottom], null, [x - 21, bottom], [x - 13, bottom]], blue, 1.2);
    text(ctx, "h", x - 30, (surfaceY + bottom) / 2 + 5, blue);
  }
  stroke(ctx, [[right, bottom], [277, bottom]], muted);
  waterStream(ctx, [[right, bottom], [326, bottom], [352, 145]], outflow, drained, [277, 146, 37]);
  text(ctx, "Outlet", 314, 114, blue);
  return `Liquid height ${pretty(level, 3)} m · Outflow ${pretty(outflow, 3)} L/s`;
}

function tankCascade(ctx, { heights, tint = [0, 0], inflow, transfer, outflow, volumes }) {
  const firstBottom = 79, secondBottom = 138;
  const firstSurface = openTank(ctx, 66, 29, 152, firstBottom, heights[0], tint[0]);
  const secondSurface = openTank(ctx, 233, 88, 319, secondBottom, heights[1], tint[1]);
  text(ctx, "Tank 1", 109, 20, purple, "center", 17);
  text(ctx, "Tank 2", 285, 79, blue, "center", 17);

  stroke(ctx, [[152, firstBottom], [249, firstBottom], [249, 90]], muted);
  waterStream(ctx, [[152, firstBottom], [249, firstBottom], [249, secondSurface]], transfer, volumes[1],
    [172, firstBottom + 11, 39]);
  text(ctx, "Transfer", 191, 112, muted, "center", 17);
  stroke(ctx, [[319, secondBottom], [334, secondBottom]], muted);
  waterStream(ctx, [[319, secondBottom], [378, secondBottom]], outflow, volumes[2],
    [333, secondBottom + 11, 39]);
  text(ctx, "Outlet", 352, 124, muted, "center", 17);

  stroke(ctx, [[15, 29], [83, 29], [83, 39]], muted);
  waterStream(ctx, [[15, 29], [83, 29], [83, Math.max(39, firstSurface)]], inflow, volumes[0],
    [21, 42, 34]);
  text(ctx, "Inlet", 38, 20, muted, "center", 17);
}

function waterLevels(ctx, { first, second, inflow, transfer, outflow, volumes }) {
  tankCascade(ctx, { heights: [first / .60, second / .60], inflow, transfer, outflow, volumes });
  return `Tank 1 ${pretty(first, 3)} m · Tank 2 ${pretty(second, 3)} m · Inflow ${pretty(inflow, 2)} L/s · Transfer ${pretty(transfer, 2)} L/s · Outlet ${pretty(outflow, 2)} L/s`;
}

function mixingTanks(ctx, { first, second, flow, volume }) {
  tankCascade(ctx, { heights: [.64, .64], tint: [first, second], inflow: flow, transfer: flow, outflow: flow,
    volumes: [volume, volume, volume] });
  return `Tank 1 ${pretty(first, 3)} g/L · Tank 2 ${pretty(second, 3)} g/L`;
}

function rod(ctx, { angle }) {
  const x = 195, y = 22, length = 116;
  const endX = x + length * Math.sin(angle), endY = y + length * Math.cos(angle);
  const centerX = (x + endX) / 2, centerY = (y + endY) / 2;
  stroke(ctx, [[x - 28, y], [x + 28, y]], muted);
  stroke(ctx, [[x, y], [x, 142]], muted, 1, [4, 4]);
  stroke(ctx, [[x, y], [endX, endY]], purple, 7);
  dot(ctx, x, y, 4, ink);
  dot(ctx, centerX, centerY, 5, orange);
  stroke(ctx, [[centerX, y + 8], [centerX, centerY]], orange, 1, [3, 3]);
  stroke(ctx, [[x, y + 12], [centerX, y + 12]], orange);
  if (Math.abs(centerX - x) > 13) text(ctx, "moment arm", Math.min(x, centerX) - 48, y + 17, orange);
  arrow(ctx, centerX, centerY, 0, 40, orange);
  text(ctx, "mg", centerX + 17, centerY + 32, orange);
}

function damperCart(ctx, { position, damperForce }) {
  const x = 156 + 12 * position;
  stroke(ctx, [[32, 106], [366, 106], null, [32, 47], [32, 106]], muted);
  dashpot(ctx, 32, 85, x - 24, 85, green, 134);
  text(ctx, "c", 53, 75, green);
  box(ctx, x - 24, 55, 48, 51, softPurple, purple);
  text(ctx, "1 kg", x, 84, purple);
  arrow(ctx, x + 25, 63, 58, 0, orange);
  arrow(ctx, x - 25, 63, (29 / 3) * damperForce, 0, green);
  text(ctx, "6 N", x + 55, 53, orange);
  text(ctx, "Damper " + pretty(damperForce) + " N", x - 55, 50, green);
}

function viscousCart(ctx, { position, appliedForce, damperForce }) {
  const x = 139 + 6.5 * position;
  stroke(ctx, [[36, 106], [366, 106], null, [36, 45], [36, 106]], muted);
  dashpot(ctx, 36, 80, x - 26, 80, green, 104);
  box(ctx, x - 26, 62, 52, 44, softPurple, purple);
  text(ctx, "1 kg", x, 89, purple);
  arrow(ctx, x - 28, 47, 59 * Math.tanh(damperForce / 2), 0, green);
  text(ctx, "Damper force", x - 49, 28, green, "center", 15);
  if (appliedForce) {
    arrow(ctx, x + 28, 47, 36, 0, orange);
    text(ctx, "2 N push", x + 49, 28, orange, "center", 15);
  }
  text(ctx, "Viscous damper", 77, 127, muted, "center", 14);
}

function gearPair(ctx, { drivenTeeth, driverAngle, drivenAngle }) {
  const radius = 39;
  const secondRadius = radius * drivenTeeth / 24;
  const driverX = 195 - secondRadius;
  const drivenX = 195 + radius;
  const middle = 77;
  for (const [x, r, teeth, rotation, name, color, side] of [
    [driverX, radius, 24, driverAngle, "Driver", purple, -1],
    [drivenX, secondRadius, drivenTeeth, drivenAngle, "Driven", green, 1]
  ]) {
    dot(ctx, x, middle, r, color === purple ? softPurple : "#e6f3ed", color);
    for (let tooth = 0; tooth < teeth; tooth += 1) {
      const angle = rotation + tooth / teeth * Math.PI * 2;
      stroke(ctx, [[x + (r - 6) * Math.cos(angle), middle - (r - 6) * Math.sin(angle)],
        [x + r * Math.cos(angle), middle - r * Math.sin(angle)]], color, 1.4);
    }
    stroke(ctx, [[x, middle], [x + .73 * r * Math.cos(rotation), middle - .73 * r * Math.sin(rotation)]], color, 3);
    dot(ctx, x, middle, 3, color);
    const labelX = x + side * (r + 12);
    const align = side < 0 ? "right" : "left";
    text(ctx, name, labelX, middle - 2, color, align);
    text(ctx, `${teeth} teeth`, labelX, middle + 17, color, align);
  }
  dot(ctx, driverX + radius, middle, 3, orange);
}

function gasMolecules(ctx, left, right, time) {
  const reflect = (value) => Math.abs(((value % 2) + 2) % 2 - 1);
  for (let index = 0; index < 19; index++) {
    const x = reflect(index * .381966 + time * (.46 + (index % 4) * .12));
    const y = reflect(index * .618034 - time * (.52 + (index % 3) * .19));
    dot(ctx, left + 6 + x * (right - left - 12), 61 + 48 * y, 2, purple);
  }
}

function actuator(ctx, { position, flow, air, time, leftPressure, rightPressure, force }) {
  const center = 195 + 55 * position / .025;
  if (air) {
    const pressureTint = (pressure) => "hsl(267 66% " + (98 - 24 * opacity((pressure - 80) / 60)) + "%)";
    box(ctx, 64, 54, center - 64, 62, pressureTint(leftPressure), purple);
    box(ctx, center, 54, 328 - center, 62, pressureTint(rightPressure), purple);
    gasMolecules(ctx, 64, center - 7, time);
    gasMolecules(ctx, center + 7, 328, time);
    text(ctx, "Sealed air chambers", 195, 23, purple, "center", 16);
    arrow(ctx, 195, 130, 61 * Math.tanh(force / 36), 0, orange);
    text(ctx, "Pressure force", 195, 150, orange, "center", 14);
  } else {
    box(ctx, 64, 54, 264, 62, water, blue);
    stroke(ctx, [[101, 54], [101, 14], null, [292, 54], [292, 14]], ink, 1.5);
    const flowArrow = 31 * Math.tanh(flow / .035);
    arrow(ctx, 115, 33 - flowArrow / 2, 0, flowArrow, blue);
    arrow(ctx, 307, 33 + flowArrow / 2, 0, -flowArrow, blue);
    text(ctx, "Left chamber", 114, 139, blue);
    text(ctx, "Right chamber", 278, 139, blue);
  }
  stroke(ctx, [[38, 85], [355, 85]], muted, 5);
  box(ctx, center - 7, 54, 14, 62, softPurple, purple);
}

function slidingRod(ctx, { time, field, driven, current, force, position, velocity, emf }) {
  const x = 220 + 44 * position;
  const top = 36, bottom = 116;
  const fieldLabel = { out: "B out of page", into: "B into page", parallel: "B up the rod" }[field];
  text(ctx, fieldLabel, 14, 18, green, "left", 14);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const bx = 118 + 33 * col, by = 51 + 25 * row;
      if (field === "parallel") arrow(ctx, bx, by + 5, 0, -11, "#79a399");
      else {
        dot(ctx, bx, by, 5, "#f4faf7", "#79a399");
        if (field === "out") dot(ctx, bx, by, 1.4, green);
        else stroke(ctx, [[bx-2,by-2],[bx+2,by+2],null,[bx-2,by+2],[bx+2,by-2]], green, 1.2);
      }
    }
  }
  stroke(ctx, [[358, top], [49, top], [49, 60], null, [49, 92], [49, bottom], [358, bottom]], muted, 2.5);
  dot(ctx, 49, 76, 16, "#fff", ink);
  if (driven) arrow(ctx, 49, 76 - 9 * Math.sign(current), 0, 18 * Math.sign(current), blue);
  else {
    text(ctx, "V", 49, 81, ink);
    text(ctx, "−", 33, 57, muted);
    text(ctx, "+", 33, 108, muted);
  }
  text(ctx, driven ? "Current source" : "Voltmeter", 49, 142, ink, "center", 13);
  stroke(ctx, [[x, top], [x, bottom]], purple, 8);
  if (driven) {
    const pitch = 16;
    const offset = ((-time * current * 16) % pitch + pitch) % pitch;
    for (let y = top + offset; y < bottom; y += pitch) dot(ctx, x, y, 2.5, "#77d8ff");
  }
  for (const y of [top,bottom]) dot(ctx, x, y, 4, "#fff", purple);
  if (emf !== 0) {
    text(ctx, emf > 0 ? "−" : "+", x + 12, top - 6, purple);
    text(ctx, emf > 0 ? "+" : "−", x + 12, bottom + 16, purple);
  }
  if (force) {
    const dx = 50 * Math.sign(force);
    arrow(ctx, x, 76, dx, 0, orange);
    text(ctx, "F", x + dx, 67, orange);
  }
  if (velocity) {
    const dx = 30 * velocity;
    arrow(ctx, x, 145, dx, 0, blue);
    text(ctx, "v", x + dx + Math.sign(dx) * 9, 149, blue);
  }
}

export const motionViews = {
  "sliding-rod": slidingRod,
  "second-order": mechanical, feedback: mechanical,
  rc: circuit, rl: circuit, rlc: circuit,
  motor, draining: drain, "tank-levels": waterLevels, thermal: heat, mixing: mixingTanks,
  "thermal-pair": heat, ladder, galvanometer,
  "pinned-rod": rod, "damper-cart": damperCart, "viscous-damper": viscousCart, gears: gearPair, hydraulic: actuator
};

export function drawLabMotion(canvas, kind, state) {
  const drawing = surface(canvas);
  if (!drawing) return "";
  const { ctx, width, height } = drawing;
  const scale = Math.min(width / 390, height / 154, 1.35);
  ctx.save();
  ctx.translate((width - 390 * scale) / 2, (height - 154 * scale) / 2);
  ctx.scale(scale, scale);
  const reading = motionViews[kind](ctx, state, kind);
  ctx.restore();
  return reading;
}
