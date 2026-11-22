const cursorDot = document.createElement("div");
const cursorRing = document.createElement("div");

cursorDot.className = "cursor-dot";
cursorRing.className = "cursor-ring";

document.body.append(cursorDot, cursorRing);

let cursorX = 0;
let cursorY = 0;
let ringX = 0;
let ringY = 0;

const cursorEnabled = window.matchMedia(
  "(pointer: fine) and (prefers-reduced-motion: no-preference)",
).matches;

if (cursorEnabled) {
  window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  });

  function animateCursor() {
    ringX += (cursorX - ringX) * 0.12;
    ringY += (cursorY - ringY) * 0.12;

    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener("mouseover", (event) => {
    if (event.target.closest("a, button")) {
      cursorRing.classList.add("cursor-hover");
    } else {
      cursorRing.classList.remove("cursor-hover");
    }
  });
}

// Touch trail
const touchTrailEnabled = window.matchMedia(
  "(pointer: coarse) and (prefers-reduced-motion: no-preference)",
).matches;

if (touchTrailEnabled) {
  let lastTrailTime = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "touch") return;

      const now = Date.now();

      if (now - lastTrailTime < 35) return;
      lastTrailTime = now;

      const trail = document.createElement("span");
      trail.className = "touch-trail";

      trail.style.left = `${event.clientX}px`;
      trail.style.top = `${event.clientY}px`;

      document.body.appendChild(trail);

      setTimeout(() => trail.remove(), 500);
    },
    { passive: true },
  );
}