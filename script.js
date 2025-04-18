const fetchDreams = async () => {
  const endpoint = "https://cobudget.com/api";
  const query = `
      query Buckets($groupSlug: String, $roundSlug: String!, $offset: Int, $limit: Int, $status: [StatusType!]) { 
        bucketsPage(
          groupSlug: $groupSlug
          roundSlug: $roundSlug
          offset: $offset
          limit: $limit
          status: $status
        ) {
          buckets {
            id
            title
            description
            summary
            noOfFunders
            totalContributions
            totalContributionsFromCurrentMember
            noOfComments
            status
            percentageFunded
            minGoal
            maxGoal
            images {
              large
            }
          }
        }
      }
    `;

  const variables = {
    groupSlug: "borderland",
    roundSlug: "borderland-dreams-2025",
    offset: 0,
    limit: 10, // Limit to 5 buckets
    status: ["OPEN_FOR_FUNDING"], // Only fetching buckets with this status
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Error:", data.errors);
      return;
    }

    const buckets = data.data.bucketsPage.buckets;

    // Handling empty buckets state
    if (!buckets || buckets.length === 0) {
      document.querySelector(".loading").textContent = "No buckets found.";
      return;
    }

    // Using DocumentFragment to append multiple items
    const fragment = document.createDocumentFragment();
    buckets.forEach((bucket) => {
      const bucketDiv = document.createElement("div");
      bucketDiv.className = "bucket";
      bucketDiv.innerHTML = `
          <h3>${bucket.title}</h3>
          <p><strong>Summary:</strong> ${bucket.summary || "N/A"}</p>
          <p><strong>Description:</strong> ${bucket.description || "N/A"}</p>
          <p><strong>No. of Funders:</strong> ${bucket.noOfFunders}</p>
          <p><strong>No. of Comments:</strong> ${bucket.noOfComments}</p>
          <p><strong>Percentage Funded:</strong> ${bucket.percentageFunded}%</p>
          <p><strong>Minimum Goal:</strong> ${bucket.minGoal}</p>
          <p><strong>Maximum Goal:</strong> ${bucket.maxGoal}</p>
          ${
            bucket.images && bucket.images.length > 0
              ? bucket.images
                  .map(
                    (image) =>
                      `<img src="${image.large}" alt="${bucket.title} large" style="max-width: 100%; height: auto;" />`
                  )
                  .join("")
              : "No images available."
          }
        `;
      fragment.appendChild(bucketDiv);
    });

    // Append the fragment to the bucket list
    document.getElementById("buckets-list").appendChild(fragment);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.querySelector(".loading").textContent = "Error fetching data.";
  } finally {
    // Hide loading text after data is fetched
    document.querySelector(".loading").style.display = "none";
  }
};

// Run the function to fetch dreams when the page loads
window.onload = fetchDreams;
