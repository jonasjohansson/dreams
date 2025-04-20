import { renderBuckets } from "./renderBuckets.js";

let isLoading = false;
let allLoaded = false;
let offset = 0;
let limit = 9;
let tag = "";
const loadingEl = document.querySelector(".loading");
const allBuckets = [];

export const fetchDreams = async () => {
  if (isLoading || allLoaded) return;
  isLoading = true;

  try {
    const response = await fetch("https://cobudget.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query Buckets($groupSlug: String, $roundSlug: String!, $tag: String, $offset: Int, $limit: Int, $status: [StatusType!]) { 
            bucketsPage(
              groupSlug: $groupSlug
              roundSlug: $roundSlug
              offset: $offset
              limit: $limit
              tag: $tag
              status: $status
            ) {
              moreExist
              buckets {
                id
                title
                summary
                noOfFunders
                noOfComments
                percentageFunded
                minGoal
                maxGoal
                income
                images { small, large }
                customFields {
                  value
                  customField { name }
                }
              }
            }
          }
        `,
        variables: {
          groupSlug: "borderland",
          roundSlug: "borderland-dreams-2025",
          offset,
          tag,
          limit,
          status: ["OPEN_FOR_FUNDING"],
        },
      }),
    });

    const { data } = await response.json();
    const page = data?.bucketsPage;
    const buckets = page?.buckets || [];
    console.log(buckets);

    if (!buckets.length) {
      loadingEl.textContent =
        offset === 0 ? "No buckets found." : "No more dreams to load.";
      allLoaded = true;
      return;
    }

    allBuckets.push(...buckets);
    renderBuckets(buckets);

    offset += limit;
    //limit += 9;

    if (!page.moreExist) {
      allLoaded = true;
      loadingEl.style.display = "none";
    } else {
      loadingEl.textContent = `Loaded ${offset}/464 dreams`;
    }

    isLoading = false;

    fetchDreams(); // continue loading
  } catch (error) {
    console.error("Error fetching dreams:", error);
    isLoading = false;
  }
};
