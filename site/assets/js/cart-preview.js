import { models } from "./lab-models.js";
import { activatePlayback } from "./lab-playback.js";

const preview = document.querySelector(".cart-preview");
const damping = preview.querySelector("#preview-damping");
const output = preview.querySelector("output");
const cart = preview.querySelector("[data-moving-cart]");
const coil = preview.querySelector("[data-coil]");
const positionLabel = preview.querySelector("#preview-position");
const trace = preview.querySelector("[data-trace]");
const currentPoint = preview.querySelector("[data-current-position]");
const crossingPoint = preview.querySelector("[data-crossing]");
const crossingLabel = preview.querySelector("#preview-crossing");
const lecture = preview.querySelector("[data-preview-lecture]");
const model = models["second-order"];
const frameCount = Number(preview.querySelector("[data-lab-time]").max);
const settings = { mass: 1, stiffness: 16, damping: damping.valueAsNumber };
let points = [];
let crossingTime;

function draw(time) {
  const position = model.value(time, 0, settings);
  // SVG coordinates: 10 cm of travel is 50 units; the unstretched coil occupies 117.
  const travel = 500 * position;
  cart.setAttribute("transform", "translate(" + travel + " 0)");
  coil.setAttribute("transform", "scale(" + (117 + travel) / 96 + " 1)");
  const cm = 100 * position;
  const distance = Math.abs(cm) < .05 ? "less than 0.1" : Math.abs(cm).toFixed(1);
  positionLabel.textContent = cm === 0 ? "At equilibrium" :
    distance + " cm " + (cm < 0 ? "left" : "right") + " of equilibrium";

  const frame = Math.round(time / model.xMax * frameCount);
  trace.setAttribute("points", points.slice(0, frame + 1).join(" "));
  currentPoint.setAttribute("cx", (100 * time / model.xMax) + "%");
  currentPoint.setAttribute("cy", (100 * (11 - cm) / 22) + "%");
  const crossed = time >= crossingTime;
  crossingPoint.setAttribute("visibility", crossed ? "visible" : "hidden");
  let message = "Below the dashed line, the cart is left of equilibrium.";
  if (crossed) message = "First crossed equilibrium at " + crossingTime.toFixed(2) + " s.";
  else if (frame === frameCount) message = "The cart stayed above zero for the full 6 seconds.";
  if (crossingLabel.textContent !== message) crossingLabel.textContent = message;
}

const playback = activatePlayback(preview, model.xMax, draw);
function resetTime() {
  playback.reset();
  playback.show();
}
function setDamping() {
  settings.damping = damping.valueAsNumber;
  points = Array.from({ length: frameCount + 1 }, (_, frame) => {
    const time = frame * model.xMax / frameCount;
    return time + "," + (-100 * model.value(time, 0, settings));
  });
  // For release from rest, the first zero satisfies tan(ωd t) = ωd / Re(p).
  const [[real, frequency]] = model.poles(0, settings);
  crossingTime = frequency > 0 ? Math.atan2(frequency, real) / frequency : Infinity;
  if (Number.isFinite(crossingTime)) crossingPoint.setAttribute("cx", (100 * crossingTime / model.xMax) + "%");
  output.value = damping.valueAsNumber.toFixed(1) + " N·s/m";
  damping.setAttribute("aria-valuetext", output.value);
  const url = new URL(lecture.href);
  url.searchParams.set("damping", damping.value);
  lecture.href = url.href;
  resetTime();
}
preview.querySelector("[data-preview-reset]").addEventListener("click", resetTime);
damping.addEventListener("input", setDamping);
setDamping();
preview.querySelector(".cart-history").hidden = false;
preview.querySelector(".preview-time").hidden = false;
preview.querySelector("[data-preview-controls]").hidden = false;
