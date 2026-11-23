export const frameStep = .02;
export const gravity = 9.81;

function rk4(state, time, step, slope) {
  const advance = (rate, size) => state.map((value, index) => value + size * rate[index]);
  const first = slope(state, time);
  const second = slope(advance(first, step / 2), time + step / 2);
  const third = slope(advance(second, step / 2), time + step / 2);
  const fourth = slope(advance(third, step), time + step);
  return state.map((value, i) => value + step * (first[i] + 2 * second[i] + 2 * third[i] + fourth[i]) / 6);
}

function sample(duration, atTime) {
  return Array.from({ length: Math.round(duration / frameStep) + 1 }, (_, index) => atTime(index * frameStep));
}

function simulate(duration, state, slope) {
  const substeps = 4;
  const step = frameStep / substeps;
  return sample(duration, (time) => {
    const previous = state;
    for (let i = 0; i < substeps; i += 1) state = rk4(state, time + i * step, step, slope);
    return previous;
  });
}

export function wrapAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export const pendulumPresets = {
  gentle: [.45, 0],
  large: [2, 0],
  upright: [3.05, 0]
};

export const pendulumAcceleration = (angle, velocity) => -gravity * Math.sin(angle) - .45 * velocity;

function pendulum(settings) {
  const initial = [Number(settings.angle), Number(settings.velocity)];
  const nonlinear = simulate(8, initial, ([angle, velocity]) => [velocity, pendulumAcceleration(angle, velocity)]);
  const linear = simulate(8, initial, ([angle, velocity]) => [velocity, -gravity * angle - .45 * velocity]);
  return {
    showLinear: settings.overlay === "on",
    frames: nonlinear.map(([angle, velocity], index) => ({
      angle: wrapAngle(angle),
      velocity,
      linearAngle: linear[index][0],
      linearVelocity: linear[index][1]
    }))
  };
}

function pinnedRod(settings) {
  const length = 1.2;
  const initial = Number(settings.release) * Math.PI / 180;
  const angularAcceleration = (angle) => -3 * gravity * Math.sin(angle) / (2 * length);
  const frames = simulate(6, [initial, 0], ([angle, velocity]) => [velocity, angularAcceleration(angle)])
    .map(([angle, velocity]) => ({
      angle, velocity, acceleration: angularAcceleration(angle), arm: length / 2 * Math.sin(angle)
    }));
  return { frames };
}

function forceOnDamper() {
  return { frames: sample(3, (time) => {
    const transient = Math.exp(-3 * time);
    const velocity = 2 - transient;
    return {
      position: 2 * time + (transient - 1) / 3,
      velocity,
      acceleration: 3 * transient,
      damperForce: -3 * velocity
    };
  }) };
}

function viscousDamper(settings) {
  const coefficient = Number(settings.damping);
  const driven = settings.input === "push";
  const appliedForce = driven ? 2 : 0;
  const initialVelocity = driven ? 0 : 1;
  const steadyVelocity = appliedForce / coefficient;
  return { frames: sample(5, (time) => {
    const transient = (initialVelocity - steadyVelocity) * Math.exp(-coefficient * time);
    const velocity = steadyVelocity + transient;
    return {
      position: steadyVelocity * time + (initialVelocity - steadyVelocity - transient) / coefficient,
      velocity, appliedForce, damperForce: -coefficient * velocity, dissipatedPower: coefficient * velocity ** 2
    };
  }) };
}

function gears(settings) {
  const drivenTeeth = Number(settings.teeth);
  const driverSpeed = 2;
  const drivenSpeed = -driverSpeed * 24 / drivenTeeth;
  return { frames: sample(6, (time) => ({
    driverSpeed, drivenSpeed, drivenTeeth, driverAngle: driverSpeed * time, drivenAngle: drivenSpeed * time
  })) };
}

function hydraulic(settings) {
  const frequency = Number(settings.frequency);
  const amplitude = .025;
  const angularFrequency = 2 * Math.PI * frequency;
  const area = .001;
  return { frames: sample(6, (time) => {
    const position = amplitude * Math.sin(angularFrequency * time);
    const velocity = amplitude * angularFrequency * Math.cos(angularFrequency * time);
    if (settings.medium === "air") {
      const initialVolume = .0001;
      const leftVolume = initialVolume + area * position;
      const rightVolume = initialVolume - area * position;
      const leftPressure = 100 * initialVolume / leftVolume;
      const rightPressure = 100 * initialVolume / rightVolume;
      return { position, velocity, time, air: true, leftPressure, rightPressure,
        force: 1000 * area * (leftPressure - rightPressure), leftVolume, rightVolume };
    }
    return { position, velocity, flow: 1000 * area * velocity };
  }) };
}

export const oscillator = { mass: 1, damping: 2.4, stiffness: 16 };
const decayRate = oscillator.damping / (2 * oscillator.mass);
const frequencySquared = oscillator.stiffness / oscillator.mass;
const dampedFrequency = Math.sqrt(frequencySquared - decayRate ** 2);
export const pulseDuration = 2;

export const signalFields = {
  force: ["Applied force", "N"],
  net: ["Force sum", "N"],
  acceleration: ["Acceleration", "m/s²"],
  velocity: ["Velocity", "m/s"],
  position: ["Displacement", "m"],
  damper: ["Damper force", "N"],
  spring: ["Spring force", "N"]
};

export function impulseResponse(time) {
  if (time < 0) return 0;
  return Math.exp(-decayRate * time) * Math.sin(dampedFrequency * time) / (oscillator.mass * dampedFrequency);
}

function stepPosition(time) {
  if (time < 0) return 0;
  const angle = dampedFrequency * time;
  return (1 - Math.exp(-decayRate * time) *
    (Math.cos(angle) + decayRate / dampedFrequency * Math.sin(angle))) / oscillator.stiffness;
}

function inputProfile(choice) {
  const widths = { pulse: pulseDuration, narrow: .1, wide: .25 };
  const width = widths[choice] ?? Infinity;
  const amplitude = choice === "narrow" || choice === "wide" ? 1 / width : 1;
  return { width, amplitude, idealImpulse: choice === "impulse" };
}

export function inputForce(time, profile) {
  return !profile.idealImpulse && time >= 0 && time < profile.width ? profile.amplitude : 0;
}

function forceResponse(time, profile) {
  const { width, amplitude, idealImpulse } = profile;
  const force = inputForce(time, profile);
  const position = idealImpulse ? impulseResponse(time)
    : amplitude * (stepPosition(time) - stepPosition(time - width));
  const velocity = idealImpulse
    ? Math.exp(-decayRate * time) *
      (Math.cos(dampedFrequency * time) - decayRate / dampedFrequency * Math.sin(dampedFrequency * time)) / oscillator.mass
    : amplitude * (impulseResponse(time) - impulseResponse(time - width));
  const spring = -oscillator.stiffness * position;
  const damper = -oscillator.damping * velocity;
  const net = force + spring + damper;
  return { force, spring, damper, net, acceleration: net / oscillator.mass, velocity, position };
}

function stepImpulse(settings) {
  const profile = inputProfile(settings.input);
  return { profile, frames: sample(6, (time) => forceResponse(time, profile)) };
}

function signalFlow(settings) {
  const response = stepImpulse(settings);
  const { mass, damping, stiffness } = oscillator;
  let state = [0, 0];
  const substep = frameStep / 4;
  // Advance the two integrator states independently of the transfer-function formula.
  const integrated = sample(6, (time) => {
    const position = state[0];
    for (let i = 0; i < 4; i += 1) {
      const force = inputForce(time + (i + .5) * substep, response.profile);
      state = rk4(state, time + i * substep, substep,
        ([x, v]) => [v, (force - damping * v - stiffness * x) / mass]);
    }
    return position;
  });
  return { ...response, integrated };
}

function convolution(settings) {
  const profile = inputProfile(settings.input);
  return {
    profile,
    frames: sample(6, (time) => ({
      input: inputForce(time, profile),
      output: forceResponse(time, profile).position
    }))
  };
}

function modes(settings) {
  const initial = {
    "in-phase": [.08, 0],
    "out-of-phase": [0, .08],
    mixture: [.06, .04]
  };
  const [inPhase, outOfPhase] = initial[settings.preset];
  return {
    frames: sample(7, (time) => {
      const slowMode = inPhase * Math.cos(3 * time);
      const fastMode = outOfPhase * Math.cos(5 * time);
      return { first: slowMode + fastMode, second: slowMode - fastMode, slowMode, fastMode };
    })
  };
}

export function roadHeight(time) {
  const progress = (time - .6) / .4;
  return progress >= 0 && progress <= 1 ? .03 * (1 - Math.cos(2 * Math.PI * progress)) : 0;
}

export const suspensionFields = {
  acceleration: ["Body acceleration", "m/s²"],
  travel: ["Suspension travel", "mm"]
};

let suspensionTrajectories;

function quarterCar(settings) {
  if (!suspensionTrajectories) {
    const sprungMass = 290;
    const unsprungMass = 40;
    const suspensionStiffness = 16500;
    const tireStiffness = 185000;

    function compute(damping) {
      function slope([body, bodyVelocity, wheel, wheelVelocity], time) {
        const springDamperForce = suspensionStiffness * (body - wheel) + damping * (bodyVelocity - wheelVelocity);
        return [
          bodyVelocity,
          -springDamperForce / sprungMass,
          wheelVelocity,
          (springDamperForce - tireStiffness * (wheel - roadHeight(time))) / unsprungMass
        ];
      }
      return simulate(5, [0, 0, 0, 0], slope).map((state, index) => ({
        body: state[0],
        wheel: state[2],
        travel: 1000 * (state[0] - state[2]),
        acceleration: slope(state, index * frameStep)[1]
      }));
    }

    suspensionTrajectories = { light: compute(950), firm: compute(2200) };
  }

  return {
    frames: suspensionTrajectories[settings.setup],
    comparison: suspensionTrajectories,
    metric: settings.metric,
    setup: settings.setup
  };
}

function vehicle(settings) {
  const speed = 18;
  const mass = 1500;
  const inertia = 2500;
  const frontDistance = 1.2;
  const rearDistance = 1.6;
  const frontStiffness = 75000;
  const rearStiffness = 85000;
  const steer = settings.path === "turn" ? .045 : 0;
  const imbalance = rearDistance * rearStiffness - frontDistance * frontStiffness;

  const a11 = -(frontStiffness + rearStiffness) / (mass * speed);
  const a12 = imbalance / (mass * speed) - speed;
  const a21 = imbalance / (inertia * speed);
  const a22 = -(frontDistance ** 2 * frontStiffness + rearDistance ** 2 * rearStiffness) / (inertia * speed);
  const frontForce = frontStiffness * steer;
  const b1 = frontForce / mass;
  const b2 = frontDistance * frontForce / inertia;
  const determinant = a11 * a22 - a12 * a21;

  const nominalVelocity = (-b1 * a22 + a12 * b2) / determinant;
  const nominalYawRate = (a21 * b1 - a11 * b2) / determinant;

  function slope([lateralVelocity, yawRate, , , heading]) {
    return [
      a11 * lateralVelocity + a12 * yawRate + b1,
      a21 * lateralVelocity + a22 * yawRate + b2,
      speed * Math.cos(heading) - lateralVelocity * Math.sin(heading),
      speed * Math.sin(heading) + lateralVelocity * Math.cos(heading),
      yawRate
    ];
  }

  const moderate = settings.disturbance === "moderate";
  const nominalMotion = simulate(6, [nominalVelocity, nominalYawRate, 0, 0, 0], slope);
  const disturbed = simulate(6, [nominalVelocity + (moderate ? 1.35 : .55), nominalYawRate + (moderate ? .27 : .11), 0, 0, 0], slope);

  return {
    frames: disturbed.map(([velocity, rate, x, y, heading], index) => ({
      x, y, heading,
      referenceX: nominalMotion[index][2],
      referenceY: nominalMotion[index][3],
      velocityDifference: velocity - nominalVelocity,
      rateDifference: rate - nominalYawRate,
      pathOffset: y - nominalMotion[index][3]
    }))
  };
}

function tapSum({ delay }) {
  const secondAt = { one: 1, two: 2 }[delay];
  return { frames: sample(6, time => {
    const first = impulseResponse(time);
    const second = secondAt === undefined ? 0 : impulseResponse(time - secondAt);
    return { first, second, position: first + second };
  }) };
}

function representations() {
  return { frames: sample(6, time => ({
    position: Math.exp(-time) * (Math.cos(2 * time) + 0.5 * Math.sin(2 * time)),
    velocity: -2.5 * Math.exp(-time) * Math.sin(2 * time),
    force: 0
  })) };
}

function baseResponse(settings) {
  const ratio = Number(settings.ratio);
  const damping = Number(settings.damping);
  const amplitude = r => Math.hypot(1, 2 * damping * r) / Math.hypot(1 - r*r, 2 * damping * r);
  const gain = amplitude(ratio);
  const phase = Math.atan2(2*damping*ratio, 1) - Math.atan2(2*damping*ratio, 1-ratio*ratio);
  const curve = Array.from({length: 161}, (_, i) => [i / 40, amplitude(i / 40)]);
  const frames = sample(6, time => ({
    floor: 10 * Math.sin(4 * ratio * time),
    machine: 10 * gain * Math.sin(4 * ratio * time + phase)
  }));
  return { frames, curve, gain, ratio };
}

function slidingRod({ trial, field }) {
  const driven = trial === "up" || trial === "down";
  const current = driven ? (trial === "up" ? 2 : -2) : 0;
  const normalField = { out: .5, into: -.5, parallel: 0 }[field];
  const coupling = .20 * normalField;
  const force = coupling * current;
  const acceleration = force / .25;
  const initialSpeed = { right: 1, left: -1 }[trial] ?? 0;
  return { frames: sample(2, time => {
    const velocity = initialSpeed + acceleration * time;
    const position = initialSpeed * time + .5 * acceleration * time ** 2;
    return { time, field, driven, current, force, position, velocity, emf: coupling * velocity };
  }) };
}

export const prepareActivity = {
  "sliding-rod": slidingRod,
  "tap-sum": tapSum,
  "base-response": baseResponse,
  representations,
  pendulum,
  "pinned-rod": pinnedRod,
  "damper-cart": forceOnDamper,
  "viscous-damper": viscousDamper,
  gears,
  hydraulic,
  "step-impulse": stepImpulse,
  "signal-flow": signalFlow,
  convolution,
  modes,
  "quarter-car": quarterCar,
  vehicle
};
