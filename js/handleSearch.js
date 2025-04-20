export function handleSearch(event) {
  const query = (
    event?.target?.value || document.getElementById("search-bar").value
  ).toLowerCase();
  const buckets = document.querySelectorAll(".bucket");

  buckets.forEach((bucket) => {
    const text = bucket.innerText.toLowerCase();
    //bucket.style.display = text.includes(query) ? "block" : "none";
  });
}
