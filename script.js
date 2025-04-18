let offset = 0;
const limit = 12;
let isLoading = false;
let allLoaded = false;

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
              images { large }
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

  const urlBase = "https://cobudget.com/borderland/borderland-dreams-2025";
  const fragment = document.createDocumentFragment();

  buckets.forEach(
    ({
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
    }) => {
      const bucketDiv = document.createElement("div");
      bucketDiv.className = "bucket";

      const customFieldsHTML = customFields
        .map(
          ({ customField, value }) =>
            `<p><strong>${customField?.name || "Unnamed Field"}:</strong> ${
              value || "N/A"
            }</p>`
        )
        .join("");

      const imagesHTML = images?.length
        ? images
            .map(
              (img) =>
                `<img src="${img.large}" alt="${title} image" style="max-width: 100%; height: auto;" />`
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
    }
  );

  // Append the fragment correctly to the list
  const bucketsList = document.getElementById("buckets-list");
  bucketsList.appendChild(fragment);

  loadingEl.style.display = "none";

  offset += limit;
  isLoading = false;

  if (!page.moreExist) {
    allLoaded = true;
  }

  // Fetch the next batch if there are more items available
  if (page.moreExist && !allLoaded) {
    fetchDreams();
  }
};

window.onload = () => {
  fetchDreams();
};
