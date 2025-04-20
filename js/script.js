import { fetchDreams } from "./fetchDreams.js";
import { handleSearch } from "./handleSearch.js";
import { initRatingFilter } from "./rating.js";

document.getElementById("search-bar").addEventListener("sl-input", handleSearch);
initRatingFilter();
fetchDreams();
