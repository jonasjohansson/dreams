export function removeEmojis(str = "") {
  return str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uFE0F|\u200D)+/g,
    ""
  );
}

export function cleanCustomFieldValue(value) {
  if (typeof value === "string" && value.trim().startsWith("<")) {
    return marked.parse(value); // using marked lib
  }
  return value;
}
