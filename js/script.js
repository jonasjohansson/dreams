import { fetchDreams } from "./fetchDreams.js";
import { handleSearch } from "./handleSearch.js";

document.getElementById("search-bar").addEventListener("input", handleSearch);

// Kick things off
fetchDreams();
