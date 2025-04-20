export let isLoading = false;
export let allLoaded = false;
export let offset = 0;
export const allBuckets = [];

export function updateOffset(by) {
  offset += by;
}

export function getIsLoading() {
  return isLoading;
}

export function getOffset() {
  return offset;
}

export function setLoading(value) {
  isLoading = value;
}

export function setAllLoaded(value) {
  allLoaded = value;
}

export function getAllLoaded() {
  return allLoaded;
}
