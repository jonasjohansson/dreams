export class Rating {
  constructor() {
    this.ratingKeyword = "rating-";
  }

  set(rating, bucketId) {
    if (rating === 0) {
      localStorage.removeItem(`${this.ratingKeyword}${bucketId}`);
    } else {
      localStorage.setItem(`${this.ratingKeyword}${bucketId}`, rating);
    }
  }

  get(bucketId) {
    const rating = localStorage.getItem(`${this.ratingKeyword}${bucketId}`);
    return rating === null ? 0 : parseInt(rating, 10);
  }

  getAllRatings() {
    let ratingsfromLocalStorage = Object.fromEntries(
      Object.entries(localStorage).filter(
         ([key, val])=>key.startsWith(this.ratingKeyword)
      )
   );
    let ratings = Object.entries(ratingsfromLocalStorage).map(([key, val]) => {
      return {
        bucketId: key.replace(this.ratingKeyword, ""),
        rating: parseInt(val),
      };
    });
  
    return ratings;
  }
}


/**
 * This function sets up event listeners for the checkboxes
 * and updates the body class based on the selected ratings.
 */
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