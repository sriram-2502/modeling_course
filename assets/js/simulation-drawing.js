export const ink = "#302241";
export const muted = "#62586d";
export const grid = "#e8e0ee";
export const purple = "#562f83";
export const orange = "#a64210";
export const green = "#176454";

export function surface(canvas) {
  const { width, height } = canvas.getBoundingClientRect();
  if (width < 1 || height < 1) return null;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(width * scale);
  const pixelHeight = Math.round(height * scale);
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = ink;
  ctx.font = "11px system-ui, sans-serif";
  return { ctx, width, height };
}

export function stroke(ctx, points, color, width = 2, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  let move = true;
  for (const point of points) {
    if (!point) {
      move = true;
    } else if (move) {
      ctx.moveTo(...point);
      move = false;
    } else {
      ctx.lineTo(...point);
    }
  }
  ctx.stroke();
  ctx.restore();
}

export function dot(ctx, x, y, radius, fill, line = fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = line;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

export function resistor(ctx, startX, startY, endX, endY, color, width = 7) {
  const length = Math.hypot(endX - startX, endY - startY);
  if (length < 13) {
    stroke(ctx, [[startX, startY], [endX, endY]], color);
    return;
  }
  const dx = (endX - startX) / length;
  const dy = (endY - startY) / length;
  const points = [[startX, startY]];
  for (let i = 0; i <= 12; i += 1) {
    const distance = length * (.15 + .7 * i / 12);
    const side = i === 0 || i === 12 ? 0 : (i % 2 ? width : -width);
    points.push([startX + dx * distance - dy * side, startY + dy * distance + dx * side]);
  }
  points.push([endX, endY]);
  stroke(ctx, points, color);
}

// Work along the mount-to-mount axis so horizontal and vertical symbols match.
export function spring(ctx, startX, startY, endX, endY, color, { turns = 6, radius = 5 } = {}) {
  const length = Math.hypot(endX - startX, endY - startY);
  const lead = .15 * length;
  const pitch = (length - 2 * lead) / turns;
  const points = [[0, 0], [lead, 0]];
  for (let i = 0; i < turns; i++) {
    points.push([lead + (i + .25) * pitch, radius], [lead + (i + .75) * pitch, -radius]);
  }
  points.push([length - lead, 0], [length, 0]);
  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(Math.atan2(endY - startY, endX - startX));
  stroke(ctx, points, color, 2);
  ctx.restore();
}

// The barrel is fixed to the first mount. The rod and piston move together
// with the second mount; their dimensions depend only on the reference pose.
export function dashpot(ctx, startX, startY, endX, endY, color, restLength) {
  const length = Math.hypot(endX - startX, endY - startY);
  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(Math.atan2(endY - startY, endX - startX));
  const back = .15 * restLength, face = .85 * restLength;
  const piston = length - .51 * restLength;
  const radius = Math.min(7, .14 * restLength);
  stroke(ctx, [[0, 0], [back, 0], null, [face, -radius], [back, -radius], [back, radius], [face, radius]], color);
  stroke(ctx, [[piston, -radius + 1], [piston, radius - 1]], color);
  stroke(ctx, [[piston, 0], [length, 0]], color);
  ctx.restore();
}

export function text(ctx, value, x, y, color = ink, align = "center", size = 14) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = `${size}px system-ui, sans-serif`;
  ctx.fillText(value, x, y);
}

export function box(ctx, x, y, width, height, fill, outline) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.7;
  ctx.strokeRect(x, y, width, height);
}

export function arrow(ctx, x, y, dx, dy, color) {
  const length = Math.hypot(dx, dy);
  if (length < 4) return;
  const ux = dx / length, uy = dy / length;
  const head = Math.min(8, length * .35);
  const tip = [x + dx, y + dy];
  stroke(ctx, [[x, y], tip, [tip[0] - head * (ux - .55 * uy), tip[1] - head * (uy + .55 * ux)],
    null, tip, [tip[0] - head * (ux + .55 * uy), tip[1] - head * (uy - .55 * ux)]], color, 2.3);
}

export const pretty = (value, digits = 2) => (Math.abs(value) < .5 * 10 ** -digits ? 0 : value).toFixed(digits);
export const opacity = (fraction) => Math.max(0, Math.min(1, fraction));
