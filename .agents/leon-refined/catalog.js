function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderEntry(entry) {
  const article = element("article", "entry");
  const figure = element("figure", "entry-cover");
  if (entry.cover) {
    const image = element("img", "");
    image.src = entry.cover;
    image.alt = entry.alt || "";
    figure.append(image);
    article.append(figure);
  }
  const body = element("div", "entry-body");
  const metadata = element("p", "metadata", entry.category);
  if (entry.date) {
    const date = element("time", "", entry.date);
    date.dateTime = entry.date;
    metadata.append("　／　", date);
  }
  body.append(metadata, element("h2", "", entry.title));
  if (entry.period) body.append(element("p", "period", "研究期间　" + entry.period));
  body.append(element("p", "summary", entry.description));
  const links = element("div", "links");
  for (const resource of entry.links) {
    const link = element("a", "", resource.label + (resource.download ? " ↓" : " ↗"));
    link.href = resource.url;
    if (resource.download) link.download = "";
    links.append(link);
  }
  body.append(links);
  article.append(body);
  return article;
}
document.querySelector("#entries").append(...window.leonEntries.map(renderEntry));
