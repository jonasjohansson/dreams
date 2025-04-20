import { bucketsData } from "./bucketsData.js";

import { renderBuckets } from "./renderBuckets.js";
import { getIsLoading, setLoading, setAllLoaded, allBuckets } from "./state.js";

import { setLoadingMessage, hideLoading } from "./domHelpers.js";
export async function fetchDreams() {
  if (getIsLoading()) return;
  setLoading(true);

  try {
    const buckets = bucketsData.buckets;

    if (!buckets.length) {
      setLoadingMessage("No dreams found.");
      setAllLoaded(true);
      return;
    }

    allBuckets.push(...buckets);
    renderBuckets(buckets);
    setAllLoaded(true);
    hideLoading();
  } catch (error) {
    console.error("Error loading dreams:", error);
    setLoadingMessage("Failed to load dreams.");
  } finally {
    setLoading(false);
  }
}
