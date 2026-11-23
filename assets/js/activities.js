import { frameStep, pendulumPresets, prepareActivity, signalFields, suspensionFields } from "./activity-models.js";
import { phaseInitialCondition, renderActivityView } from "./activity-views.js";

const signalInputs = {
  force: [],
  net: ["force", "spring", "damper"],
  acceleration: ["net"],
  velocity: ["acceleration"],
  position: ["velocity"],
  spring: ["position"],
  damper: ["velocity"]
};

function format(value, unit = "", digits = 2) {
  const finite = Math.abs(value) < .5 * 10 ** -digits ? 0 : value;
  return finite.toFixed(digits) + (unit ? " " + unit : "");
}

const readouts = {
  "sliding-rod": ({ current, force, velocity, emf }) => [
    ["Current (up +)", format(current, "A", 1)], ["Force (right +)", format(force, "N")],
    ["Velocity (right +)", format(velocity, "m/s")], ["Lower rail − upper rail", format(1000 * emf, "mV", 1)]
  ],
  "tap-sum": sample => [
    ["First tap", format(sample.first, "m", 3)], ["Second tap", format(sample.second, "m", 3)],
    ["Total displacement", format(sample.position, "m", 3)]
  ],
  representations: sample => [
    ["Position", format(sample.position, "m", 3)], ["Velocity", format(sample.velocity, "m/s", 3)]
  ],
  "base-response": (sample, simulation) => [
    ["Base", format(sample.floor, "mm", 1)], ["Machine", format(sample.machine, "mm", 1)],
    ["Machine amplitude", format(10 * simulation.gain, "mm", 1)], ["Amplitude ratio", format(simulation.gain)]
  ],
  pendulum: (sample, simulation) => {
    const values = [["Angle", format(sample.angle, "rad")], ["Angular velocity", format(sample.velocity, "rad/s")]];
    if (simulation.showLinear) values.push(["Small-angle prediction", format(sample.linearAngle, "rad")]);
    return values;
  },
  "pinned-rod": ({ angle, acceleration, arm }) => [
    ["Angle", format(angle * 180 / Math.PI, "°", 1)],
    ["Angular acceleration", format(acceleration, "rad/s²")],
    ["Signed moment arm", format(arm, "m", 3)]
  ],
  "damper-cart": ({ position, velocity, acceleration, damperForce }) => [
    ["Position", format(position, "m")],
    ["Speed", format(velocity, "m/s")],
    ["Damper force", format(damperForce, "N")],
    ["Net force", format(acceleration, "N")]
  ],
  "viscous-damper": ({ velocity, appliedForce, damperForce, dissipatedPower }) => [
    ["Velocity", format(velocity, "m/s")],
    ["Applied force", format(appliedForce, "N")],
    ["Damper force on cart", format(damperForce, "N")],
    ["Power dissipated", format(dissipatedPower, "W")]
  ],
  gears: ({ driverSpeed, drivenSpeed }) => [
    ["Driver speed", format(driverSpeed, "rad/s")],
    ["Driven speed", format(drivenSpeed, "rad/s")]
  ],
  hydraulic: (sample) => {
    const values = [["Piston position", format(sample.position * 1000, "mm", 1)]];
    if (sample.air) {
      return values.concat([
        ["Left pressure", format(sample.leftPressure, "kPa", 1)],
        ["Right pressure", format(sample.rightPressure, "kPa", 1)],
        ["Force on the piston", format(sample.force, "N", 1)]
      ]);
    }
    return values.concat([
      ["Piston velocity", format(sample.velocity * 1000, "mm/s", 1)],
      ["Flow into left chamber", format(sample.flow, "L/s", 3)],
      ["Flow into right chamber", format(-sample.flow, "L/s", 3)]
    ]);
  },
  "step-impulse": (sample, simulation, _signal, frame) => [
    ["Applied input", simulation.profile.idealImpulse && frame === 0 ? "1 N·s tap" : format(sample.force, "N")],
    ["Displacement", format(sample.position * 1000, "mm", 1)],
    ["Velocity", format(sample.velocity, "m/s", 3)]
  ],
  "signal-flow": (sample, simulation, signal, frame, reduction) => {
    if (reduction > 0 && signal === "position") {
      return [
        ["Full integrator model", format(simulation.integrated[frame] * 1000, "mm", 3)],
        ["Reduced transfer function", format(sample.position * 1000, "mm", 3)]
      ];
    }
    const [label, unit] = signalFields[signal];
    return [[label, format(sample[signal], unit, 3)]];
  },
  convolution: (sample) => [["Current force", format(sample.input, "N")], ["Signed area = displacement", format(sample.output * 1000, "mm", 2)]],
  modes: (sample) => [
    ["Mass 1", format(1000 * sample.first, "mm", 1)],
    ["Mass 2", format(1000 * sample.second, "mm", 1)],
    ["In-phase contribution", format(1000 * sample.slowMode, "mm", 1)],
    ["Out-of-phase contribution", format(1000 * sample.fastMode, "mm", 1)]
  ],
  "quarter-car": (_sample, simulation, _signal, frame) => {
    const [label, unit] = suspensionFields[simulation.metric];
    return [
      ["Plot quantity", label],
      ["Light damping", format(simulation.comparison.light[frame][simulation.metric], unit)],
      ["Firm damping", format(simulation.comparison.firm[frame][simulation.metric], unit)]
    ];
  },
  vehicle: (sample) => [
    ["Lateral velocity difference", format(sample.velocityDifference, "m/s", 3)],
    ["Yaw rate difference", format(sample.rateDifference, "rad/s", 3)],
    ["Y offset from nominal", format(sample.pathOffset, "m")]
  ]
};

for (const section of document.querySelectorAll("[data-activity]")) {
  const quiz = section.querySelector("[data-activity-quiz]");
  if (quiz) activateQuiz(quiz);
  const id = section.dataset.activity;
  if (prepareActivity[id]) activateSimulation(section, id);
}

function activateQuiz(form) {
  const status = form.querySelector("[data-quiz-status]");
  form.querySelector('button[type="submit"]').hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = new FormData(form).get("prediction");
    const correct = answer === form.dataset.answer;
    status.textContent = correct
      ? "Correct. " + form.dataset.feedback
      : form.querySelector("input:checked").dataset.hint;
    status.dataset.correct = String(correct);
  });
  form.addEventListener("change", () => {
    status.textContent = "";
    delete status.dataset.correct;
  });
}

function activateSimulation(section, id) {
  const live = section.querySelector("[data-activity-live]");
  const form = live.querySelector(".activity-options");
  const slider = live.querySelector("[data-time]");
  const timeValue = live.querySelector("[data-time-value]");
  const play = live.querySelector("[data-play]");
  const step = live.querySelector("[data-step]");
  const metrics = live.querySelector("[data-activity-readout]");
  const views = Array.from(live.querySelectorAll("[data-view]"), (view) => ({
    key: view.dataset.view, canvas: view.querySelector("canvas")
  }));
  if (!views.every(({ canvas }) => canvas.getContext("2d"))) return;

  const diagram = live.querySelector(".signal-diagram");
  const signalButtons = diagram ? Array.from(diagram.querySelectorAll("[data-signal]")) : [];
  const stageButtons = diagram ? Array.from(diagram.querySelectorAll("[data-reduction]")) : [];
  const stages = diagram ? Array.from(diagram.querySelectorAll("[data-diagram-stage]")) : [];
  let signal = "force";
  let reduction = 0;
  let simulation;
  let frame = 0;
  let animation;
  let startTime;
  let startFrame;

  function render() {
    slider.value = String(frame);
    timeValue.textContent = format(frame * frameStep, "s");
    slider.setAttribute("aria-valuetext", timeValue.textContent);
    step.disabled = frame === simulation.frames.length - 1;
    const sample = simulation.frames[frame];

    if (diagram) {
      for (const button of stageButtons) button.setAttribute("aria-pressed", String(Number(button.dataset.reduction) === reduction));
      for (const stage of stages) stage.hidden = Number(stage.dataset.diagramStage) !== reduction;
      for (const button of signalButtons) {
        const key = button.dataset.signal;
        button.setAttribute("aria-pressed", String(key === signal));
        button.classList.toggle("feeds-selected", signalInputs[signal].includes(key));
        button.querySelector("[data-signal-value]").textContent = format(sample[key], signalFields[key][1], 2);
      }
    }

    for (const { key, canvas } of views) renderActivityView(canvas, id, key, simulation, frame, signal, reduction);

    const values = readouts[id](sample, simulation, signal, frame, reduction);
    while (metrics.children.length < values.length) {
      const cell = document.createElement("div");
      cell.append(document.createElement("dt"), document.createElement("dd"));
      metrics.append(cell);
    }
    Array.from(metrics.children).forEach((cell, index) => {
      const pair = values[index];
      cell.hidden = !pair;
      if (pair) {
        cell.firstChild.textContent = pair[0];
        cell.lastChild.textContent = pair[1];
      }
    });
  }

  function pause() {
    cancelAnimationFrame(animation);
    animation = undefined;
    play.textContent = "Play";
  }

  function animate(timestamp) {
    startTime ??= timestamp;
    const target = Math.min(simulation.frames.length - 1, startFrame + Math.floor((timestamp - startTime) / (frameStep * 1000)));
    if (target !== frame) {
      frame = target;
      render();
    }
    if (frame === simulation.frames.length - 1) pause();
    else animation = requestAnimationFrame(animate);
  }

  function prepare(keepTime = false) {
    pause();
    simulation = prepareActivity[id](Object.fromEntries(new FormData(form)));
    slider.max = String(simulation.frames.length - 1);
    frame = keepTime ? Math.min(frame, simulation.frames.length - 1) : 0;
    render();
  }

  play.addEventListener("click", () => {
    if (animation !== undefined) {
      pause();
      return;
    }
    if (frame === simulation.frames.length - 1) frame = 0;
    startTime = undefined;
    startFrame = frame;
    play.textContent = "Pause";
    render();
    animation = requestAnimationFrame(animate);
  });
  step.addEventListener("click", () => {
    pause();
    frame = Math.min(simulation.frames.length - 1, frame + Math.round(.1 / frameStep));
    render();
  });
  live.querySelector("[data-reset-activity]").addEventListener("click", () => {
    form.reset();
    signal = "force";
    reduction = 0;
    prepare();
  });
  slider.addEventListener("input", () => {
    pause();
    frame = Number(slider.value);
    render();
  });

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("change", (event) => {
    const control = event.target;
    if (id === "pendulum") {
      const [angle, velocity, preset] = ["angle", "velocity", "preset"].map((name) => form.elements.namedItem(name));
      if (control === preset && pendulumPresets[control.value]) {
        [angle.value, velocity.value] = pendulumPresets[control.value];
      } else if (control === angle || control === velocity) {
        if (!control.validity.valid || control.value === "") control.value = control.defaultValue;
        preset.value = "custom";
      }
    }
    prepare(["overlay", "metric", "setup", "medium"].includes(control.name));
  });

  for (const button of signalButtons) {
    button.addEventListener("click", () => {
      signal = button.dataset.signal;
      render();
    });
  }
  for (const button of stageButtons) {
    button.addEventListener("click", () => {
      reduction = Number(button.dataset.reduction);
      signal = reduction > 0 ? "position" : "acceleration";
      render();
    });
  }
  if (id === "pendulum") {
    const phase = views.find(({ key }) => key === "phase").canvas;
    phase.addEventListener("click", (event) => {
      const position = phaseInitialCondition(phase, event.clientX, event.clientY);
      if (!position) return;
      for (const [index, name] of ["angle", "velocity"].entries()) {
        const input = form.elements.namedItem(name);
        input.value = Math.max(Number(input.min), Math.min(Number(input.max), position[index])).toFixed(2);
      }
      form.elements.namedItem("preset").value = "custom";
      prepare();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });

  live.hidden = false;
  if (id === "signal-flow" && new URLSearchParams(location.search).get("case") === "reduced") {
    reduction = stageButtons.length - 1;
    signal = "position";
  }
  try {
    prepare();
  } catch (error) {
    live.hidden = true;
    console.error("Could not initialize course activity:", id, error);
    return;
  }
  section.querySelector("[data-activity-reference]").open = false;
  const resize = new ResizeObserver(render);
  for (const { canvas } of views) resize.observe(canvas);
}
