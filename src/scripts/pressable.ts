// Pointer-driven pressed state for .pressable, so touch devices get the same
// instant feedback as :active on desktop. One delegated listener for the page.

const PRESSED = "is-pressed";
let pressed: HTMLElement | null = null;

function release() {
  pressed?.classList.remove(PRESSED);
  pressed = null;
}

document.addEventListener(
  "pointerdown",
  (event) => {
    if (event.button !== 0) return;
    const target = (event.target as Element | null)?.closest<HTMLElement>(".pressable");
    if (!target) return;
    pressed = target;
    target.classList.add(PRESSED);
    if (event.pointerType === "touch" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },
  { passive: true }
);

for (const type of ["pointerup", "pointercancel"] as const) {
  document.addEventListener(type, release, { passive: true });
}

document.addEventListener(
  "pointerout",
  (event) => {
    if (pressed && event.target instanceof Node && pressed.contains(event.target) && !pressed.contains(event.relatedTarget as Node | null)) {
      release();
    }
  },
  { passive: true }
);
