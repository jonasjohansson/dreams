export function setLoadingMessage(msg) {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.textContent = msg;
}

export function hideLoading() {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.style.display = "none";
}
