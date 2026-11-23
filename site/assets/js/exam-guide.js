const examNavigation = document.querySelector(".exam-picker");
const examLinks = Array.from(examNavigation.querySelectorAll("a"));

function selectExam() {
  const selected = examLinks.find(link => link.hash === location.hash) || examLinks[0];
  for (const link of examLinks) {
    const active = link === selected;
    document.getElementById(link.getAttribute("aria-controls")).hidden = !active;
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

examNavigation.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, "", link.hash);
  selectExam();
});
window.addEventListener("hashchange", selectExam);
window.addEventListener("popstate", selectExam);
selectExam();
