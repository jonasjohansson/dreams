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
    value = value
    .replace(/\r\n|\r|\n/gim, '<br>') // linebreaks
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>') // bold text
    .replace(/\*(.*)\*/gim, '<i>$1</i>') // italic text
    .replace(/\[([^\[]+)\](\(([^)]*))\)/gim, '<a href="$3">$1</a>'); // anchor tags
    

    return value;
}
