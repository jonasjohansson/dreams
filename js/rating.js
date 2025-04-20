export function renderRatingUI(bucketId, existingRating = 0) {
  const savedRating = localStorage.getItem(`rating-${bucketId}`);
  const rating = savedRating ? parseInt(savedRating) : existingRating;

  const wrapper = document.createElement("div");
  wrapper.className = "rating-wrapper";

  const starContainer = document.createElement("div");
  starContainer.className = "stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "★";
    star.dataset.value = i;

    if (i <= rating) {
      star.classList.add("rated");
    }

    star.addEventListener("click", () => {
      localStorage.setItem(`rating-${bucketId}`, i);
      const siblings = starContainer.querySelectorAll(".star");
      siblings.forEach((s, index) => {
        if (index < i) s.classList.add("rated");
        else s.classList.remove("rated");
      });
    });

    starContainer.appendChild(star);
  }

  wrapper.appendChild(starContainer);
  return wrapper;
}
