export function quadraticPoles(a, b, c) {
  const rate = b / (2 * a);
  const frequencySquared = c / a;
  const discriminant = rate ** 2 - frequencySquared;
  if (Math.abs(discriminant) <= 1e-12 * Math.max(rate ** 2, frequencySquared)) {
    return [[-rate, 0], [-rate, 0]];
  }
  if (discriminant < 0) {
    const frequency = Math.sqrt(-discriminant);
    return [[-rate, frequency], [-rate, -frequency]];
  }
  const fast = -rate - Math.sqrt(discriminant);
  return [[frequencySquared / fast, 0], [fast, 0]];
}

export function poleSummary(poles) {
  const number = (value) => Number(value.toPrecision(4)).toString();
  const [first, second] = poles;
  if (!second) return number(first[0]);
  if (first[1] > 0) return `${number(first[0])} ± ${number(first[1])}j`;
  if (first[0] === second[0]) return `${number(first[0])}, repeated`;
  return `${number(first[0])}, ${number(second[0])}`;
}

function tickSize(size) {
  const order = 10 ** Math.floor(Math.log10(size));
  return ([1, 2, 2.5, 5, 10].find((factor) => factor >= size / order) ?? 10) * order;
}

export function drawPoles(canvas, context, poles, baseline) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width < 150 || height < 160) return;
  const density = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  context.setTransform(density, 0, 0, density, 0, 0);

  const real = poles.map(([re]) => Math.abs(re));
  const imag = poles.map(([, im]) => Math.abs(im));
  // Keep the starting viewport until a pole needs more room.
  const realTick = tickSize(Math.max(baseline, ...real) / 3.6);
  const imagTick = tickSize(Math.max(baseline, ...imag) / 1.8);
  const rightTicks = Math.max(1, Math.ceil(Math.max(...poles.map(([re]) => re)) / (.9 * realTick)));
  const bounds = { left: 48, right: width - 13, top: 29, bottom: height - 38 };
  const x = (re) => bounds.left + (4 + re / realTick) / (4 + rightTicks) * (bounds.right - bounds.left);
  const y = (im) => bounds.top + (2 - im / imagTick) / 4 * (bounds.bottom - bounds.top);
  const line = (x1, y1, x2, y2) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
  const label = (value) => Number(value.toPrecision(3)).toString();
  context.font = "11px system-ui, sans-serif";
  context.lineWidth = 1;
  context.fillStyle = "#514858";
  for (let tick = -4; tick <= rightTicks; tick += 1) {
    const re = tick * realTick;
    context.strokeStyle = tick === 0 ? "#81708c" : "#e5dce9";
    line(x(re), bounds.top, x(re), bounds.bottom);
    context.textAlign = "center";
    context.fillText(label(re), x(re), bounds.bottom + 15);
  }
  for (let tick = -2; tick <= 2; tick += 1) {
    const im = tick * imagTick;
    context.strokeStyle = tick === 0 ? "#81708c" : "#e5dce9";
    line(bounds.left, y(im), bounds.right, y(im));
    context.textAlign = "right";
    context.fillText(label(im), bounds.left - 6, y(im) + 4);
  }
  context.textAlign = "left";
  context.fillText("Imaginary (s⁻¹)", bounds.left, 16);
  context.textAlign = "center";
  context.fillText("Real (s⁻¹)", (bounds.left + bounds.right) / 2, height - 6);

  context.strokeStyle = "#973e00";
  context.lineWidth = 2.3;
  const repeated = poles.length === 2 && poles[0][0] === poles[1][0] && poles[0][1] === poles[1][1];
  const markers = repeated ? poles.slice(0, 1) : poles;
  for (const [re, im] of markers) {
    const px = x(re);
    const py = y(im);
    line(px - 4, py - 4, px + 4, py + 4);
    line(px - 4, py + 4, px + 4, py - 4);
  }
  if (repeated) {
    const [re, im] = poles[0];
    context.fillStyle = "#973e00";
    context.textAlign = "right";
    context.fillText("×2", x(re) - 8, y(im) - 8);
  }
}
