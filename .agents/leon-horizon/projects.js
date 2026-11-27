const projects = {
  pelican: {
    title: "Pelican Test",
    category: "AI 实验 · SVG 动画",
    description: "同一句「画一只骑自行车的鹈鹕」，观察 GPT-6.2 Astra 与 Gemini 4 Argon 如何理解形状、动作与空间。",
    alt: "鹈鹕系着红围巾，骑自行车穿过海岸公路。",
    url: "https://u16l.com/experiments/pelican/"
  },
  invite: {
    title: "Date Invitation",
    category: "互动网页 · 邀请函",
    description: "从一封待拆的信开始，在浏览器里打开邀请、作出选择，完成一次轻巧的纸上互动。",
    alt: "互动邀请函中的纸质信封与封蜡。",
    url: "https://u16l.com/experiments/date-invite/"
  }
};
const picker = document.querySelector(".picker");
picker.hidden = false;
picker.addEventListener("click", event => {
  const button = event.target.closest("button[data-project]");
  if (!button) return;
  const key = button.dataset.project;
  const item = projects[key];
  const image = document.getElementById("project-image");
  image.src = "assets/" + key + ".webp";
  image.alt = item.alt;
  document.getElementById("project-name").textContent = item.title;
  document.getElementById("project-category").textContent = item.category;
  document.getElementById("project-desc").textContent = item.description;
  document.getElementById("project-link").href = item.url;
  for (const tab of picker.querySelectorAll("button")) {
    tab.setAttribute("aria-pressed", String(tab === button));
  }
});
