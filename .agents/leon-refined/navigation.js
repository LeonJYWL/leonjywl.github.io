const mast = document.querySelector(".mast");
mast.classList.add("floating");
let last = window.scrollY;
let queued = false;
function update() {
  const y = Math.max(0, window.scrollY);
  const compact = y > 70;
  mast.classList.toggle("compact", compact);
  if (!compact) {
    mast.classList.remove("away");
    last = y;
  } else if (Math.abs(y - last) >= 6) {
    mast.classList.toggle("away", y > last);
    last = y;
  }
  queued = false;
}
window.addEventListener("scroll", () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
}, {passive: true});
update();
