/**
 * Utility to reliably freeze background scrolling when any modal/popup is open.
 * Uses reference counting so multiple modals won't prematurely unfreeze the page.
 */

let activeModalsCount = 0;

export function lockScroll() {
  activeModalsCount++;
  if (activeModalsCount === 1) {
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }
  }
}

export function unlockScroll() {
  activeModalsCount = Math.max(0, activeModalsCount - 1);
  if (activeModalsCount === 0) {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
  }
}
