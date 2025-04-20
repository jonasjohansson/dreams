export function renderRatingUI(bucketId, existingRating = 0) {
  const savedRating = localStorage.getItem(`rating-${bucketId}`);
  const rating = savedRating ? parseInt(savedRating, 10) : existingRating;

  const wrapper = document.createElement("div");
  const starContainer = document.createElement("div");
  starContainer.className = "stars";
  wrapper.setAttribute("data-rating", rating);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "★";
    star.dataset.value = i;
    if (i <= rating) star.classList.add("rated");

    star.addEventListener("click", () => {
      localStorage.setItem(`rating-${bucketId}`, i);
      wrapper.setAttribute("data-rating", i);
      starContainer.querySelectorAll(".star").forEach((s, index) => {
        s.classList.toggle("rated", index < i);
      });
    });

    starContainer.appendChild(star);
  }

  wrapper.appendChild(starContainer);
  return wrapper;
}

export function getRating(bucketId) {
  const rating = localStorage.getItem(`rating-${bucketId}`);
  return rating === null ? 0 : parseInt(rating, 10);
}

export function initRatingFilter() {
  const checkboxes = document.querySelectorAll(".rating-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedRatings = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.dataset.rating);

      document.body.className = "";
      selectedRatings.forEach((rating) => {
        document.body.classList.add(`rating-${rating}`);
      });
    });
  });
}
