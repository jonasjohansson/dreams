export function renderRatingUI(bucketId, existingRating = 0) {
  const savedRating = localStorage.getItem(`rating-${bucketId}`);
  let currentRating = savedRating ? parseInt(savedRating, 10) : existingRating;

  const wrapper = document.createElement("div");
  const starContainer = document.createElement("div");
  starContainer.className = "stars";
  wrapper.setAttribute("data-rating", currentRating);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "★";
    star.dataset.value = i;

    if (i <= currentRating) {
      star.classList.add("rated");
    }

    star.addEventListener("click", () => {
      const newRating = parseInt(star.dataset.value, 10);
      if (newRating === currentRating) {
        // Clicking the same rating again -> remove it
        localStorage.removeItem(`rating-${bucketId}`);
        currentRating = 0;
      } else {
        // Set new rating
        localStorage.setItem(`rating-${bucketId}`, newRating);
        currentRating = newRating;
      }

      wrapper.setAttribute("data-rating", currentRating);

      // Update star UI
      starContainer.querySelectorAll(".star").forEach((s, index) => {
        s.classList.toggle("rated", index < currentRating);
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
