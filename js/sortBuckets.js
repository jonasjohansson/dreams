import {
  allBuckets,
  getOffset
} from "./state.js";
import { renderBuckets } from "./renderBuckets.js";

export function sortBuckets(event) {
  let sortedBuckets = [...allBuckets];

  switch (event.target.value) {
    case "name-asc":
      sortedBuckets.sort(compareStringsAscOrder);
      break;
    case "name-desc":
      sortedBuckets.sort(compareStringsAscOrder).reverse();
      break;
    case "fund-percent-asc":
      sortedBuckets.sort(compareFundPercentAscOrder);
      break;
    case "fund-percent-desc":
      sortedBuckets.sort(compareFundPercentAscOrder).reverse();
      break;
    case "fund-asc":
      sortedBuckets.sort(compareFundAscOrder);
      break;
    case "fund-desc":
      sortedBuckets.sort(compareFundAscOrder).reverse();
      break;
    case "budget-min-asc":
      sortedBuckets.sort(compareBudgetMinAscOrder);
      break;
    case "budget-min-desc":
      sortedBuckets.sort(compareBudgetMinAscOrder).reverse();
      break;
    case "budget-max-asc":
      sortedBuckets.sort(compareBudgetMaxAscOrder);
      break;
    case "budget-max-desc":
      sortedBuckets.sort(compareBudgetMaxAscOrder).reverse();
      break;
    default: // Random
      break;
  }
  const list = document.getElementById("buckets-list");
  list.innerHTML = "";

  const chunkSize = 27;//getOffset();
  for (let i = 0; i < sortedBuckets.length; i += chunkSize) {
    const chunk = sortedBuckets.slice(i, i + chunkSize);
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
}
let compareFundPercentAscOrder = function (a, b) {
  return a.percentageFunded - b.percentageFunded;
}
let compareFundAscOrder = function (a, b) {
  return ((a.percentageFunded/100) * (a.minGoal/100)) - ((b.percentageFunded/100) * (b.minGoal/100));
}
let compareBudgetMinAscOrder = function (a, b) {
  return a.minGoal - b.minGoal;
}
let compareBudgetMaxAscOrder = function (a, b) {
  return a.maxGoal - b.maxGoal;
}