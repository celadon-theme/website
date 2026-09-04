// Copy `text` to the clipboard and flash `label` on `el` for a moment before
// putting `restore` back — the design's "Copy → Copied" swap.
const timers = new WeakMap();

export async function copyWithFeedback(el, text, label, restore) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return; // clipboard unavailable (insecure context, denied) — leave the label alone
  }
  clearTimeout(timers.get(el));
  el.textContent = label;
  el.classList.add('is-copied');
  timers.set(el, setTimeout(() => {
    el.textContent = restore;
    el.classList.remove('is-copied');
  }, 1500));
}
