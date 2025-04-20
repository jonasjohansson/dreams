import { bucketsData } from "./bucketsData.js";
import { renderBuckets } from "./renderBuckets.js";
import { getIsLoading, setLoading, setAllLoaded, allBuckets } from "./state.js";
import { setLoadingMessage, hideLoading, shuffleArray } from "./domHelpers.js";

export async function fetchDreams(chunkSize = 27, delay = 500) {
  if (getIsLoading()) return;
  setLoading(true);

  try {
    // 🌀 Shuffle buckets before rendering
    const buckets = shuffleArray([...bucketsData.buckets]);

    if (!buckets.length) {
      setLoadingMessage("No dreams found.");
      setAllLoaded(true);
      return;
    }

    const total = buckets.length;

    // Staggered rendering
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = buckets.slice(i, i + chunkSize);
      renderBuckets(chunk);

      // Wait a bit before rendering the next chunk
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setAllLoaded(true);
    hideLoading();
  } catch (error) {
    console.error("Error loading dreams:", error);
    setLoadingMessage("Failed to load dreams.");
  } finally {
    setLoading(false);
  }
}
