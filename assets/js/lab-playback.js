export function activatePlayback(section, horizon, render) {
  const play = section.querySelector("[data-lab-play]");
  const slider = section.querySelector("[data-lab-time]");
  const step = section.querySelector("[data-lab-step]");
  const value = section.querySelector("[data-lab-time-value]");
  const lastFrame = Number(slider.max);
  const playbackSeconds = Math.max(4, Math.min(10, horizon));
  let frame = 0;
  let request;
  let startedAt;
  let startFrame;

  function show() {
    const time = horizon * frame / lastFrame;
    slider.value = frame;
    value.textContent = `${time.toFixed(horizon >= 100 ? 1 : 2)} s`;
    slider.setAttribute("aria-valuetext", value.textContent);
    if (step) step.disabled = frame === lastFrame;
    render(time);
  }

  function pause() {
    cancelAnimationFrame(request);
    request = undefined;
    play.textContent = "Play";
  }

  function animate(timestamp) {
    startedAt ??= timestamp;
    const next = Math.min(lastFrame, startFrame + Math.floor(lastFrame * (timestamp - startedAt) / (playbackSeconds * 1000)));
    if (frame !== next) {
      frame = next;
      show();
    }
    if (frame === lastFrame) pause();
    else request = requestAnimationFrame(animate);
  }

  play.addEventListener("click", () => {
    if (request !== undefined) {
      pause();
      return;
    }
    if (frame === lastFrame) frame = 0;
    startedAt = undefined;
    startFrame = frame;
    play.textContent = "Pause";
    show();
    request = requestAnimationFrame(animate);
  });
  step?.addEventListener("click", () => {
    pause();
    frame = Math.min(lastFrame, frame + 3);
    show();
  });
  slider.addEventListener("input", () => {
    pause();
    frame = slider.valueAsNumber;
    show();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });

  return {
    show, pause,
    reset() {
      pause();
      frame = 0;
    }
  };
}
