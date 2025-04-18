let isLoading = false;
let allLoaded = false;
let offset = 0;
let limit = 9;
let allBuckets = []; // Store all fetched buckets globally
const searchBar = document.getElementById("search-bar");
const loadingEl = document.querySelector(".loading");

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
      bucketDiv.style.transition = `opacity 0.6s ease ${index * 50}ms`;

      const customFieldsHTML = customFields
        .map(
          ({ customField, value }) =>
            `<p><strong>${
              customField?.name || "Unnamed Field"
            }:</strong> ${cleanCustomFieldValue(value)}</p>`
        )
        .join("");

      const coverImage = images[0]?.small;
      const imagesHTML =
        images?.length > 1
          ? images
              .slice(1)
              .map((img) => `<img src="${img.small}" alt="${title} image" />`)
              .join("")
          : "<p>No images available.</p>";

      title = removeEmojis(title);
      summary = removeEmojis(summary);

      bucketDiv.innerHTML = `
      <header>
        <h3><a href="${urlBase}/${id}">${title}</a></h3>
      </header>
      <main>
        <p>${summary || "N/A"}</p>
      <img class="cover" src="${coverImage}">

      ${imagesHTML}
      <div class="custom-fields">
        ${customFieldsHTML || "<p>No custom fields found.</p>"}
      </div>

      </main>

      <footer>

        <p class="funders-comments">
          <span class="icon funder-icon">💰</span>
          <span><strong>${noOfFunders}</strong> Funders</span>
          <span class="icon comment-icon">💬</span>
          <span><strong>${noOfComments}</strong> Comments</span>
        </p>

        <div class="progress-bar-container">
          <p><strong>Percentage Funded:</strong></p>
          <div class="progress-bar">
            <div class="progress" style="width: ${percentageFunded}%"></div>
          </div>
          <p>${percentageFunded}%</p>
        </div>

        <div class="goals">
          <div class="goal">
            <p><strong>Min Goal:</strong> <span>${minGoal}</span></p>
          </div>
          <div class="goal">
            <p><strong>Max Goal:</strong> <span>${maxGoal}</span></p>
          </div>
        </div>
      </footer>

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

  try {
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
          offset,
          limit,
          status: ["OPEN_FOR_FUNDING"],
        },
      }),
    });

    const { data } = await response.json();
    const page = data?.bucketsPage;
    const buckets = page?.buckets || [];

    // Log the fetched buckets for debugging
    console.log("Fetched buckets:", buckets);

    if (!buckets.length) {
      loadingEl.textContent =
        offset === 0 ? "No buckets found." : "No more dreams to load.";
      allLoaded = true;
      return;
    }

    allBuckets.push(...buckets); // Add to global array
    renderBuckets(buckets); // Render only the new buckets

    offset += limit;
    limit += 9; // You can tweak this to adjust the "page size" for each fetch

    if (!page.moreExist) {
      allLoaded = true;
      loadingEl.style.display = "none";
    } else {
      loadingEl.textContent = `Loaded ${offset}/464 dreams`;
      console.log(`More dreams remain. Currently at offset: ${offset}`);
    }

    isLoading = false;

    // Fetch more until everything is loaded
    fetchDreams();
  } catch (error) {
    console.error("Error fetching dreams:", error);
    isLoading = false;
  }
};

function handleSearch(event) {
  const query = (event?.target?.value || searchBar.value).toLowerCase();
  const buckets = document.querySelectorAll(".bucket");

  buckets.forEach((bucket) => {
    const text = bucket.innerText.toLowerCase();
    bucket.style.display = text.includes(query) ? "block" : "none";
  });
}

function removeEmojis(text) {
  // Check if the text is valid (not null or undefined)
  if (text && typeof text === "string") {
    return text.replace(/emojiRegex/g, ""); // Replace emojis here
  }
  return text; // Return the original value if it's null or invalid
}

const cleanCustomFieldValue = (value) => {
  if (!value) return "N/A"; // Handle empty or undefined values

  // Remove emojis
  return removeEmojis(value);
};

window.onload = () => {
  fetchDreams();

  // Set up search handler
  searchBar.addEventListener("input", handleSearch);
};
