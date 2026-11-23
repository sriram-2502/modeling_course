for (const link of document.links) {
  if ((link.protocol === "https:" || link.protocol === "http:") && link.origin !== location.origin) {
    link.target = "_blank";
    link.relList.add("noopener", "noreferrer");
  }
}

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#course-nav");

if (menu && navigation) {
  const compact = matchMedia("(max-width: 1024px)");
  let open = false;

  function updateMenu() {
    menu.hidden = !compact.matches;
    navigation.hidden = compact.matches && !open;
    menu.setAttribute("aria-expanded", String(!navigation.hidden));
  }

  menu.addEventListener("click", () => {
    open = !open;
    updateMenu();
  });
  navigation.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && compact.matches && open) {
      open = false;
      updateMenu();
      menu.focus();
    }
  });
  compact.addEventListener("change", updateMenu);
  updateMenu();
}

const search = document.querySelector(".course-search");
const query = new URLSearchParams(location.search).get("q")?.trim() || "";

if (search) {
  search.hidden = false;
  if (query) search.elements.q.value = query;
}

const results = document.querySelector("[data-search-results]");
if (results) renderSearch(results);

async function renderSearch(results) {
  const status = results.querySelector("[data-search-status]");
  const list = results.querySelector("[data-search-list]");
  if (!query) {
    status.textContent = "Enter a topic in the search field above.";
    return;
  }

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  try {
    const response = await fetch(results.dataset.index);
    if (!response.ok) throw new Error("Search index unavailable");

    const entries = await response.json();
    const matches = entries.map((entry) => {
      const title = entry.title.toLowerCase();
      const detail = (entry.summary + " " + entry.text).toLowerCase();
      const score = tokens.reduce((total, token) => {
        return total + (title.includes(token) ? 5 : detail.includes(token) ? 1 : 0);
      }, 0);
      const matchesAll = tokens.every((token) => title.includes(token) || detail.includes(token));
      const phrase = query.toLowerCase();
      const keywords = entry.keywords || "";
      const phraseBonus = keywords === phrase ? 30 : title.startsWith(phrase) ? 20 : keywords.includes(phrase) ? 12 : 0;
      return { entry, score: score + phraseBonus, matchesAll };
    }).filter((match) => match.matchesAll).sort((a, b) => b.score - a.score);

    const count = matches.length;
    status.textContent = count
      ? count + (count === 1 ? " result" : " results") + " for “" + query + "”."
      : "No results for “" + query + "”. Try another lecture topic.";

    for (const { entry } of matches) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.url;
      link.textContent = entry.title;
      item.append(link);
      if (entry.summary) {
        const description = document.createElement("p");
        description.textContent = entry.summary;
        item.append(description);
      }
      list.append(item);
    }
  } catch {
    status.textContent = "Search is temporarily unavailable. Use the lecture index to find a topic.";
  }
}

// Local progress is optional. The course remains usable with storage disabled.
const storageKey = "me3050:" + document.body.dataset.courseRoot;
function readProgress(key) {
  try { return localStorage.getItem(storageKey + key); } catch { return null; }
}
function saveProgress(key, value) {
  try { localStorage.setItem(storageKey + key, value); } catch { /* Private browsing. */ }
}

for (const mark of document.querySelectorAll("[data-practiced]")) {
  mark.hidden = readProgress("skill:" + mark.dataset.practiced) !== "yes";
}
for (const section of document.querySelectorAll("[data-skill]")) {
  const form = section.querySelector("form");
  form.querySelector("button").hidden = false;
  const status = form.querySelector("[role=status]");
  form.addEventListener("change", () => { status.textContent = ""; });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = form.querySelector("input:checked");
    if (!selected) return;
    if (selected.dataset.correct === "yes") {
      status.textContent = "Correct. " + section.dataset.feedback;
      saveProgress("skill:" + section.dataset.skill, "yes");
    } else {
      status.textContent = selected.dataset.hint;
    }
  });
}
const jumps = document.querySelector("[data-lesson-jumps]");
if (jumps) {
  const headings = document.querySelectorAll(".prose h2[id]");
  jumps.append("On this page ");
  for (const heading of headings) {
    if (heading.id === "opening-questions") continue;
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    jumps.append(link);
  }
  jumps.hidden = false;
}
