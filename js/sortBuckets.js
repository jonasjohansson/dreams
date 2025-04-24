import { allBuckets, getOffset } from "./state.js";
import { renderBuckets } from "./renderBuckets.js";
import { Rating } from "./rating.js";

export function sortBuckets(event) {
  const rating = new Rating();
  const visibleBuckets = document.querySelectorAll(".bucket:not(.hidden)");
  let bucketList = allBuckets.filter(bucket => {
    return Array.from(visibleBuckets).some(visibleBucket => {
      return visibleBucket.dataset.bucketId === bucket.id;
    });
  });
  
  switch (event.target.value) {
    case "name-asc":
      bucketList.sort(compareStringsAscOrder);
      break;
    case "name-desc":
      bucketList.sort(compareStringsAscOrder).reverse();
      break;
    case "fund-percent-asc":
      bucketList.sort(compareFundPercentAscOrder);
      break;
    case "fund-percent-desc":
      bucketList.sort(compareFundPercentAscOrder).reverse();
      break;
    case "fund-asc":
      bucketList.sort(compareFundAscOrder);
      break;
    case "fund-desc":
      bucketList.sort(compareFundAscOrder).reverse();
      break;
    case "budget-min-asc":
      bucketList.sort(compareBudgetMinAscOrder);
      break;
    case "budget-min-desc":
      bucketList.sort(compareBudgetMinAscOrder).reverse();
      break;
    case "budget-max-asc":
      bucketList.sort(compareBudgetMaxAscOrder);
      break;
    case "budget-max-desc":
      bucketList.sort(compareBudgetMaxAscOrder).reverse();
      break;
    case "rating-asc":
      sortByRating(bucketList, rating.getAllRatings(), true);
      break;
    case "rating-desc":
      sortByRating(bucketList, rating.getAllRatings());
      break;
    default: // Random
      break;
  }
  const list = document.getElementById("buckets-list");
  list.innerHTML = "";

  const chunkSize = 27; //getOffset();
  for (let i = 0; i < bucketList.length; i += chunkSize) {
    const chunk = bucketList.slice(i, i + chunkSize);
    renderBuckets(chunk);
  }
}

let compareStringsAscOrder = function (a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
};
let compareFundPercentAscOrder = function (a, b) {
  return a.percentageFundedTrue - b.percentageFundedTrue;
};
let compareFundAscOrder = function (a, b) {
  return a.percentageFunded * a.minGoal - b.percentageFunded * b.minGoal;
};
let compareBudgetMinAscOrder = function (a, b) {
  return a.minGoal - b.minGoal;
};
let compareBudgetMaxAscOrder = function (a, b) {
  return a.maxGoal - b.maxGoal;
};
let sortByRating = function (allDreams, ratings, ascOrder = false) {
  // Loop through the ratings 1-5 and add them to the start of the array
  // magically dreams with rating 5 will be added lastly to the start (making them first)

  let findDreamsAndMove = function (allDreams, currentRatingValue) {
    let dreams = ratings.filter(r => r.rating === currentRatingValue);
    for (let i = 0; i < dreams.length; i++) {
      allDreams.moveToStart(allDreams.findIndex(d => d.id === dreams[i].bucketId));
    }
  };

  if (ascOrder) {
    for (let currentRatingValue = 5; currentRatingValue > 0; currentRatingValue--) {
      findDreamsAndMove(allDreams, currentRatingValue);
    }
  }
  else {
    for (let currentRatingValue = 1; currentRatingValue < 6; currentRatingValue++) {
      findDreamsAndMove(allDreams, currentRatingValue);
    }
  }
};

Array.prototype.moveToStart = function (from) {
  let itemToMove = this.splice(from, 1)[0];
  this.unshift(itemToMove);
  return this;
};