let isLoading = false;
let allLoaded = false;
let offset = 0;
let limit = 9;
const searchBar = document.getElementById("search-bar");

let allBuckets = []; // Store all fetched buckets globally

const renderBuckets = (bucketsToRender) => {
  const list = document.getElementById("buckets-list");
  const urlBase = "https://cobudget.com/borderland/borderland-dreams-2025";
  const fragment = document.createDocumentFragment();

  bucketsToRender.forEach(
    (
      {
        id,
        title,
        summary,
        noOfFunders,
        noOfComments,
        percentageFunded,
        minGoal,
        maxGoal,
        images,
        customFields,
      },
      index
    ) => {
      const bucketDiv = document.createElement("div");
      bucketDiv.className = "bucket";
      bucketDiv.style.opacity = 0;
      bucketDiv.style.transition = "opacity 0.6s ease";
      bucketDiv.style.transitionDelay = `${index * 50}ms`;

      const customFieldsHTML = customFields
        .map(
          ({ customField, value }) =>
            `<p><strong>${customField?.name || "Unnamed Field"}:</strong> ${
              value ? marked.parse(value) : "N/A"
            }</p>`
        )
        .join("");

      const imagesHTML = images?.length
        ? images
            .map(
              (img) =>
                `<img src="${img.small}" alt="${title} image" style="max-width: 100%; height: auto;" />`
            )
            .join("")
        : "<p>No images available.</p>";

      bucketDiv.innerHTML = `
        <h3><a href="${urlBase}/${id}">${title}</a></h3>
        <p><strong>Summary:</strong> ${summary || "N/A"}</p>
        <p><strong>No. of Funders:</strong> ${noOfFunders}</p>
        <p><strong>No. of Comments:</strong> ${noOfComments}</p>
        <p><strong>Percentage Funded:</strong> ${percentageFunded}%</p>
        <p><strong>Minimum Goal:</strong> ${minGoal}</p>
        <p><strong>Maximum Goal:</strong> ${maxGoal}</p>
        ${imagesHTML}
        <div class="custom-fields">${
          customFieldsHTML || "<p>No custom fields found.</p>"
        }</div>
      `;

      fragment.appendChild(bucketDiv);

      // Trigger fade-in
      setTimeout(() => {
        bucketDiv.style.opacity = 1;
      }, 50 * index);
    }
  );

  list.appendChild(fragment);

  handleSearch(); // So search applies to new elements
};

const fetchDreams = async () => {
  if (isLoading || allLoaded) return;
  isLoading = true;

  const response = await fetch("https://cobudget.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query Buckets($groupSlug: String, $roundSlug: String!, $offset: Int, $limit: Int, $status: [StatusType!]) { 
          bucketsPage(
            groupSlug: $groupSlug
            roundSlug: $roundSlug
            offset: $offset
            limit: $limit
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
        offset: offset,
        limit: limit,
        status: ["OPEN_FOR_FUNDING"],
      },
    }),
  });

  const { data } = await response.json();
  const page = data?.bucketsPage;
  const buckets = page?.buckets || [];

  const loadingEl = document.querySelector(".loading");

  if (!buckets.length) {
    if (offset === 0) {
      loadingEl.textContent = "No buckets found.";
    } else {
      loadingEl.textContent = "No more dreams to load.";
    }
    allLoaded = true;
    return;
  }

  // Only append new buckets (buckets fetched on this call)
  allBuckets.push(...buckets); // Add to global array
  renderBuckets(buckets); // Render only the new buckets

  offset += limit;
  limit += 9; // You can tweak this to adjust the "page size" for each fetch
  isLoading = false;

  if (!page.moreExist) {
    allLoaded = true;
    loadingEl.style.display = "none";
  } else {
    loadingEl.textContent = `Loaded ${offset}/464 dreams`;
    console.log(`More dreams remain. Currently at offset: ${offset}`);
  }

  // Fetch more until everything is loaded
  fetchDreams();
};

function handleSearch(event) {
  const query =
    event?.target?.value?.toLowerCase() || searchBar.value.toLowerCase();
  const buckets = document.querySelectorAll(".bucket");

  buckets.forEach((bucket) => {
    const text = bucket.innerText.toLowerCase();
    bucket.style.display = text.includes(query) ? "block" : "none";
  });
}

window.onload = () => {
  fetchDreams();

  // Set up search handler
  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("input", handleSearch);
};
