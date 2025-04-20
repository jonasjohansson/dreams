import { renderBuckets } from "./renderBuckets.js";
import { fetchBuckets } from "./api.js";
import {
  getIsLoading,
  getAllLoaded,
  getOffset,
  updateOffset,
  allBuckets,
  setLoading,
  setAllLoaded,
} from "./state.js";

import { setLoadingMessage, hideLoading } from "./domHelpers.js";
import { DEFAULT_LIMIT } from "./config.js";

export async function fetchDreams() {
  if (getIsLoading() || getAllLoaded()) return;
  setLoading(true);

  try {
    const offset = getOffset();
    const { buckets, moreExist } = await fetchBuckets(offset);

    if (!buckets.length) {
      setLoadingMessage(
        offset === 0 ? "No buckets found." : "No more dreams to load."
      );
      setAllLoaded(true);
      return;
    }

    allBuckets.push(...buckets);
    renderBuckets(buckets);
    updateOffset(DEFAULT_LIMIT);

    if (!moreExist) {
      setAllLoaded(true);
      hideLoading();
    } else {
      setLoadingMessage(`Loaded ${getOffset()}/464 dreams`);
    }

    setLoading(false);
    fetchDreams(); // load next page
  } catch (error) {
    console.error("Error fetching dreams:", error);
    setLoading(false);
  }
}
