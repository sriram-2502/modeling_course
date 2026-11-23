import { quadraticPoles } from "./lab-poles.js";

const exponential = (time, tau, final, initial = 0) => final + (initial - final) * Math.exp(-time / tau);
const fixed = (number, precision, unit) => number.toFixed(precision) + (unit ? " " + unit : "");
const acceleration = 9.81;

function unitFreeResponse(time, [[first, frequency], [second]]) {
  if (frequency > 0) {
    return Math.exp(first * time) *
      (Math.cos(frequency * time) - first / frequency * Math.sin(frequency * time));
  }
  if (first === second) {
    return (1 - first * time) * Math.exp(first * time);
  }
  return (first * Math.exp(second * time) - second * Math.exp(first * time)) / (first - second);
}

function unitFreeSlope(time, [[first, frequency], [second]]) {
  if (frequency > 0) {
    return -(first ** 2 + frequency ** 2) * Math.exp(first * time) * Math.sin(frequency * time) / frequency;
  }
  if (first === second) return -(first ** 2) * time * Math.exp(first * time);
  return first * second * (Math.exp(second * time) - Math.exp(first * time)) / (first - second);
}

function mechanicalSystem(ratio, { mass = 1, stiffness = 16, damping } = {}) {
  const coefficient = damping ?? 2 * ratio * Math.sqrt(mass * stiffness);
  return { mass, stiffness, coefficient, poles: quadraticPoles(mass, coefficient, stiffness) };
}

function dampingMetrics(ratio, settings) {
  const { mass, stiffness, coefficient, poles } = mechanicalSystem(ratio, settings);
  const natural = Math.sqrt(stiffness / mass);
  return [
    ["Response", dampingRegime(poles)],
    ["Natural frequency ωₙ", fixed(natural, 2, "rad/s"), { labelTex: "\\text{Natural frequency }\\omega_n" }],
    ["Damping ratio ζ", fixed(coefficient / (2 * Math.sqrt(mass * stiffness)), 2), { labelTex: "\\text{Damping ratio }\\zeta" }],
    ["c", fixed(coefficient, 2, "N·s/m"), { labelTex: "c" }],
    ["x(1 s)", fixed(.1 * unitFreeResponse(1, poles), 4, "m"), { labelTex: "x(1\\,\\mathrm{s})" }]
  ];
}

function dampingRegime([[first, frequency], [second]]) {
  if (frequency > 0) return first === 0 ? "Undamped" : "Underdamped";
  return first === second ? "Critically damped" : "Overdamped";
}

const rcTime = (resistance, { capacitance = 1 } = {}) => resistance * capacitance;
const rlTime = (resistance, { inductance = 1 } = {}) => inductance / resistance;
const rlcPoles = (resistance, { inductance = 1, capacitance = 1 } = {}) =>
  quadraticPoles(inductance * capacitance, resistance * capacitance, 1);
const motorConstants = { supply: 5, inductance: .5, friction: .04, coupling: .10, field: .50, radius: .10, loadTime: 2 };
const motorCoefficients = (resistance, { inertia = .02 } = {}) => [
  motorConstants.inductance * inertia,
  motorConstants.inductance * motorConstants.friction + resistance * inertia,
  resistance * motorConstants.friction + motorConstants.coupling ** 2
];
const motorPoles = (resistance, settings) => quadraticPoles(...motorCoefficients(resistance, settings));
const steadySpeed = (resistance, load = 0) =>
  (motorConstants.supply * motorConstants.coupling - resistance * load) / motorCoefficients(resistance)[2];

function motorDrive(time, resistance, { inertia = .02, load = 0 } = {}) {
  const { supply, inductance, friction, coupling, field, radius, loadTime } = motorConstants;
  const [a, b, c] = motorCoefficients(resistance, { inertia });
  const poles = quadraticPoles(a, b, c);
  const step = (t) => {
    const value = 1 - unitFreeResponse(t, poles);
    const slope = -unitFreeSlope(t, poles);
    return { value, slope, integral: t - (a * slope + b * value) / c };
  };
  const drive = step(time);
  const delayedLoad = time >= loadTime ? step(time - loadTime) : { value: 0, slope: 0, integral: 0 };
  const speed = (supply * coupling * drive.value - load * (inductance * delayedLoad.slope + resistance * delayedLoad.value)) / c;
  const angle = (supply * coupling * drive.integral - load * (inductance * delayedLoad.value + resistance * delayedLoad.integral)) / c;
  const current = (supply * (inertia * drive.slope + friction * drive.value) + coupling * load * delayedLoad.value) / c;
  const torque = coupling * current;
  return { speed, angle, current, torque, backEmf: coupling * speed, force: torque / (2 * radius), field,
    forceScale: .55, loadTorque: time >= loadTime ? load : 0 };
}
const feedbackPoles = (gain, { damping = 2.4 } = {}) => quadraticPoles(1, damping, 16 + gain);
const thermalTime = (capacitance, { resistance = .4 } = {}) => capacitance * resistance;
const temperature = (time, capacitance, settings) =>
  exponential(time, thermalTime(capacitance, settings), 20 + 50 * (settings?.resistance ?? .4), 20);
const tankHeight = (time, outlet) => .60 * Math.max(0, 1 - time / emptyingTime(outlet)) ** 2;
const gravityOutflow = (outlet, level) => .062 * outlet * Math.sqrt(2 * acceleration * level);
function cascadeStep(time, timeConstant) {
  const t = time / timeConstant;
  return { first: 1 - Math.exp(-t), second: 1 - (1 + t) * Math.exp(-t) };
}

const pumpDuration = 30;
const levelTimeConstant = 20;
const tankArea = .020;

function cascadeLevels(time, pumpRate) {
  const on = cascadeStep(time, levelTimeConstant);
  const off = cascadeStep(Math.max(0, time - pumpDuration), levelTimeConstant);
  const equilibrium = (pumpRate / 1000) * levelTimeConstant / tankArea;
  return { first: equilibrium * (on.first - off.first), second: equilibrium * (on.second - off.second) };
}

function cascadeFlows(time, rate) {
  const { first, second } = cascadeLevels(time, rate);
  const toLiters = 1000 * tankArea;
  const pumped = rate * Math.min(time, pumpDuration);
  return { first, second, inflow: time < pumpDuration ? rate : 0,
    transfer: first * toLiters / levelTimeConstant, outflow: second * toLiters / levelTimeConstant,
    volumes: [pumped, pumped - first * toLiters, pumped - (first + second) * toLiters] };
}

const flowPlot = (xMax, max, series) => ({ xMax, min: 0, max, digits: 2, label: "Flow rate (L/s)", series });
const flowLine = (label, color, dash, value, eventTime) => ({ label, color, dash, value, eventTime });
const inletColor = "#70509a";
const outletColor = "#1268a4";

const mixing = (time, flow) => cascadeStep(time, 2 / flow);
const thermalPair = (time, resistance) => {
  const difference = 40 * Math.exp(-2 * time / (100 * resistance));
  return { first: 40 + difference / 2, second: 40 - difference / 2, loss: difference / resistance };
};
const ladderState = (time, resistance) => {
  const poles = quadraticPoles(resistance ** 2, 3 * resistance, 1);
  const second = 5 * (1 - unitFreeResponse(time, poles));
  const current = -5 * unitFreeSlope(time, poles);
  return { first: second + resistance * current, second, current };
};
const galvanometerConstants = { inertia: .002, stiffness: .018, coupling: .05, field: .50, radius: .025 };
const galvanometerPoles = (damping) => quadraticPoles(galvanometerConstants.inertia, damping, galvanometerConstants.stiffness);
const finalPointerAngle = (milliamps) => galvanometerConstants.coupling * (milliamps / 1000) / galvanometerConstants.stiffness;
const degrees = (radians) => radians * 180 / Math.PI;

function galvanometerDrive(time, damping, { driveCurrent = 20 } = {}) {
  const { coupling, field, radius, stiffness } = galvanometerConstants;
  const poles = galvanometerPoles(damping);
  const current = driveCurrent / 1000;
  const finalAngle = finalPointerAngle(driveCurrent);
  const angle = finalAngle * (1 - unitFreeResponse(time, poles));
  const velocity = -finalAngle * unitFreeSlope(time, poles);
  const torque = coupling * current;
  return { angle, pointerAngle: degrees(angle), targetAngle: degrees(finalAngle), current, torque, backEmf: coupling * velocity,
    force: torque / (2 * radius), field, forceScale: .015, springTorque: -stiffness * angle };
}

function emptyingTime(outlet) {
  const initialHeight = .60;
  const dischargeCoefficient = .62;
  const outletArea = outlet * 1e-4;
  return tankArea * Math.sqrt(2 * initialHeight / acceleration) / (dischargeCoefficient * outletArea);
}

export const models = {
  "first-order": {
    xMax: 8, min: 0, max: 1, digits: 1, label: "Response x(t)",
    value: (time, tau) => exponential(time, tau, 1),
    poles: (tau) => [[-1 / tau, 0]],
    metrics: (tau) => [
      ["Time constant", fixed(tau, 2, "s")],
      ["x(1 s)", fixed(exponential(1, tau, 1), 3), { labelTex: "x(1\\,\\mathrm{s})" }],
      ["Final value", "1.00"]
    ]
  },
  "second-order": {
    xMax: 6, min: -.10, max: .10, digits: 2, label: "Displacement (m)",
    value: (time, ratio, settings) => .1 * unitFreeResponse(time, mechanicalSystem(ratio, settings).poles),
    poles: (ratio, settings) => mechanicalSystem(ratio, settings).poles,
    metrics: dampingMetrics
  },
  rc: {
    xMax: 8, min: 0, max: 5, digits: 1, label: "Capacitor voltage (V)",
    value: (time, resistance, settings) => exponential(time, rcTime(resistance, settings), 5),
    poles: (resistance, settings) => [[-1 / rcTime(resistance, settings), 0]],
    metrics: (resistance, settings) => [
      ["Time constant RC", fixed(rcTime(resistance, settings), 2, "s")],
      ["Voltage at 1 s", fixed(exponential(1, rcTime(resistance, settings), 5), 2, "V")],
      ["Steady voltage", "5.00 V"]
    ]
  },
  rlc: {
    xMax: 12, min: 0, max: 10, digits: 1, label: "Capacitor voltage (V)",
    value: (time, resistance, settings) => 5 * (1 - unitFreeResponse(time, rlcPoles(resistance, settings))),
    poles: rlcPoles,
    metrics: (resistance, settings = { inductance: 1, capacitance: 1 }) => [
      ["Response", dampingRegime(rlcPoles(resistance, settings))],
      ["Critical resistance", fixed(2 * Math.sqrt(settings.inductance / settings.capacitance), 2, "Ω")],
      ["Steady voltage", "5.00 V"]
    ]
  },
  rl: {
    xMax: 8, min: 0, max: 10, digits: 1, label: "Inductor current (A)",
    value: (time, resistance, settings) => exponential(time, rlTime(resistance, settings), 5 / resistance),
    poles: (resistance, settings) => [[-1 / rlTime(resistance, settings), 0]],
    metrics: (resistance, settings) => [
      ["Time constant L/R", fixed(rlTime(resistance, settings), 2, "s")],
      ["Steady current", fixed(5 / resistance, 2, "A")]
    ]
  },
  motor: {
    xMax: 5, min: 0, max: 20, digits: 1, label: "Shaft speed (rad/s)",
    value: (time, resistance, settings) => motorDrive(time, resistance, settings).speed,
    poles: motorPoles,
    metrics: (resistance, settings) => [
      ["Response", dampingRegime(motorPoles(resistance, settings))],
      ["Steady speed", fixed(steadySpeed(resistance, settings?.load), 2, "rad/s")]
    ]
  },
  feedback: {
    xMax: 6, min: 0, max: 1.6, digits: 1, label: "Position (m)",
    value: (time, gain, settings) => gain / (16 + gain) * (1 - unitFreeResponse(time, feedbackPoles(gain, settings))),
    poles: feedbackPoles,
    metrics: (gain, settings) => [
      ["Response", dampingRegime(feedbackPoles(gain, settings))],
      ["Final position", fixed(gain / (16 + gain), 3, "m")],
      ["Steady tracking error", fixed(16 / (16 + gain), 3, "m")]
    ]
  },
  draining: {
    xMax: 120, min: 0, max: .60, digits: 2, label: "Liquid height (m)",
    value: tankHeight,
    flowChart: flowPlot(120, 1, [
      flowLine("Outlet", outletColor, [], (t, outlet) => gravityOutflow(outlet, tankHeight(t, outlet))),
      flowLine("Inlet (closed)", inletColor, [6, 4], () => 0)
    ]),
    metrics: (outlet) => [["Time to empty", fixed(emptyingTime(outlet), 2, "s")]]
  },
  "tank-levels": {
    xMax: 120, min: 0, max: .60, digits: 2, label: "Water level (m)",
    value: (time, rate) => cascadeLevels(time, rate).second,
    companion: (time, rate) => cascadeLevels(time, rate).first,
    companionKey: "Dashed purple: Tank 1 water level. Solid blue: Tank 2 water level.",
    flowChart: flowPlot(120, .80, [
      flowLine("Outlet", outletColor, [], (t, rate) => cascadeFlows(t, rate).outflow),
      flowLine("Between tanks", "#176454", [2, 3], (t, rate) => cascadeFlows(t, rate).transfer),
      flowLine("Inlet", inletColor, [6, 4], (t, rate) => cascadeFlows(t, rate).inflow, pumpDuration)
    ]),
    metrics: (rate) => {
      const levels = cascadeLevels(pumpDuration, rate);
      return [
        ["Tank 1 at pump shutoff", fixed(levels.first, 3, "m")],
        ["Tank 2 at pump shutoff", fixed(levels.second, 3, "m")]
      ];
    }
  },
  thermal: {
    xMax: 600, min: 20, max: 60, digits: 0, label: "Temperature (°C)",
    value: temperature,
    poles: (capacitance, settings) => [[-1 / thermalTime(capacitance, settings), 0]],
    metrics: (capacitance, settings = { resistance: .4 }) => [
      ["Time constant", fixed(thermalTime(capacitance, settings), 0, "s")],
      ["Temperature at 100 s", fixed(temperature(100, capacitance, settings), 2, "°C")],
      ["Steady temperature", fixed(20 + 50 * settings.resistance, 0, "°C")]
    ]
  },
  mixing: {
    xMax: 32, min: 0, max: 1, digits: 2, label: "Concentration (g/L)",
    value: (time, flow) => mixing(time, flow).second,
    companion: (time, flow) => mixing(time, flow).first,
    companionKey: "Dashed purple: Tank 1 concentration. Solid blue: Tank 2 outlet concentration.",
    flowChart: flowPlot(32, 1.2, [
      flowLine("Inlet, transfer, and outlet (equal)", outletColor, [], (_, flow) => flow)
    ]),
    metrics: (flow) => [
      ["Time constant per tank", fixed(2 / flow, 2, "s")],
      ["Final concentration", "1 g/L"]
    ]
  },
  "thermal-pair": {
    xMax: 200, min: 20, max: 60, digits: 0, label: "Body 2 temperature (°C)",
    value: (time, resistance) => thermalPair(time, resistance).second,
    metrics: (resistance) => [
      ["Temperature-difference time constant", fixed(50 * resistance, 1, "s")],
      ["Common final temperature", "40 °C"]
    ]
  },
  ladder: {
    xMax: 20, min: 0, max: 5, digits: 1, label: "Second node voltage (V)",
    value: (time, resistance) => ladderState(time, resistance).second,
    metrics: (resistance) => [
      ["Isolated-stage RC", fixed(resistance, 2, "s")],
      ["Final node voltages", "5.00 V"]
    ]
  },
  galvanometer: {
    xMax: 5, min: 0, max: 8, digits: 1, label: "Pointer angle (°)",
    color: "#973e00",
    companion: (_time, _damping, { driveCurrent = 20 } = {}) => degrees(finalPointerAngle(driveCurrent)),
    companionKey: "The solid orange curve follows the pointer. The dashed purple line is its steady angle for the selected current. A peak above that line is overshoot.",
    value: (time, damping, settings) => galvanometerDrive(time, damping, settings).pointerAngle,
    metrics: (damping, { driveCurrent = 20 } = {}) => [
      ["Response", dampingRegime(galvanometerPoles(damping))],
      ["Final reading", fixed(degrees(finalPointerAngle(driveCurrent)), 2) + "°"]
    ]
  }
};

export const motionSamples = {
  "second-order": (_time, _ratio, _settings, position) => ({ position, travel: .1 }),
  feedback: (_time, gain, _settings, position) => ({
    position, travel: 1.6, reference: 1, gain, force: gain * (1 - position)
  }),
  rc: (_time, resistance, { capacitance = 1 }, voltage) =>
    ({ voltage, current: (5 - voltage) / resistance, currentUnit: "mA", charge: capacitance * voltage }),
  rl: (time, resistance, settings, current) =>
    ({ voltage: 5 - resistance * current, current, currentUnit: "A", charge: 5 * time / resistance - rlTime(resistance, settings) * current }),
  rlc: (time, resistance, settings, voltage) => ({
    voltage, current: -5 * settings.capacitance * unitFreeSlope(time, rlcPoles(resistance, settings)), currentUnit: "A",
    charge: settings.capacitance * voltage
  }),
  motor: motorDrive,
  draining: (_time, outlet, _settings, level) => ({
    level, outflow: gravityOutflow(outlet, level), drained: tankArea * (.60 - level) * 1000
  }),
  "tank-levels": cascadeFlows,
  thermal: (_time, _capacitance, { resistance }, temperature) => ({
    temperature, input: 50, loss: (temperature - 20) / resistance
  }),
  mixing: (time, flow) => ({ ...mixing(time, flow), flow, volume: time * flow }),
  "thermal-pair": thermalPair,
  ladder: ladderState,
  galvanometer: galvanometerDrive
};

