const main = document.querySelector("main");
const options = {
  output: "htmlAndMathml",
  trust: false
};

if (main && window.katex) {
  for (const equation of main.querySelectorAll("[data-tex]")) {
    const rendered = document.createElement("span");
    try {
      window.katex.render(equation.dataset.tex, rendered, {
        ...options,
        displayMode: equation.hasAttribute("data-display")
      });
      equation.replaceChildren(rendered);
    } catch (error) {
      console.warn("Unable to typeset a course equation.", error);
    }
  }

  window.renderMathInElement?.(main, {
    ...options,
    delimiters: [
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    ignoredClasses: ["math-expression"]
  });
}
