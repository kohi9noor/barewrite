/**
 * DOM utilities for checking element properties and visibility
 */

export function isLikelyWritingSurface(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  /**
   * filter out elements that are too small to be writing surfaces,
   */
  if (rect.width < 100 || rect.height < 20) {
    return false;
  }

  const style = window.getComputedStyle(el);
  /**
   * filter out elements that are not visisble,
   * as writing surfaces are usually visible, and if they are not visible, they are not useful
   */
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  )
    return false;

  if (el.getAttribute("aria-hidden") === "true") return false;

  return true;
}

export function isVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0" ||
    el.hasAttribute("aria-hidden")
  ) {
    return false;
  }

  if (el.offsetParent === null && style.position !== "fixed") {
    return false;
  }

  if (rect.width < 5 || rect.height < 5) {
    return false;
  }

  if (
    rect.bottom < 0 ||
    rect.right < 0 ||
    rect.top > window.innerHeight ||
    rect.left > window.innerWidth
  ) {
    return false;
  }

  return true;
}
