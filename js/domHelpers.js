export function setLoadingMessage(msg) {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.textContent = msg;
}

export function hideLoading() {
  const loadingEl = document.querySelector(".loading");
  if (loadingEl) loadingEl.classList.add("hidden");
}

// Simple Fisher-Yates shuffle
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function removeEmojis(str = "") {
  return str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uFE0F|\u200D)+/g,
    ""
  );
}

export function cleanCustomFieldValue(value) {
  //if (typeof value === "string" && value.trim().startsWith("<")) {
  //  return marked.parse(value); // using marked lib
  //}
  return value;
}
