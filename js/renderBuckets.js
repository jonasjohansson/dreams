import { handleSearch } from "./handleSearch.js";
import { removeEmojis, cleanCustomFieldValue } from "./utils.js";

export const renderBuckets = (bucketsToRender) => {
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
        income,
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

      const cleanTitle = removeEmojis(title || "");
      const cleanSummary = removeEmojis(summary || "");
      const incomeCents = income / 100;
      const minCents = minGoal / 100;
      const maxCents = maxGoal / 100;
      const funded = Math.round(
        minCents * (percentageFunded / 100) - incomeCents
      );
      const percentageFunded2 = ((funded / minCents) * 100).toFixed(2);

      bucketDiv.innerHTML = `
        <header>
          <h3><a href="${urlBase}/${id}">${cleanTitle}</a></h3>
        </header>
        <main>
          <p>${cleanSummary || "N/A"}</p>
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
              <div class="progress" style="width: ${percentageFunded2}%"></div>
            </div>
            <p>${percentageFunded2}%</p>
          </div>
          <div class="goals">
            <p><strong>Min Goal:</strong> ${minCents}</p>
            <p><strong>Max Goal:</strong> ${maxCents}</p>
          </div>
        </footer>
      `;

      fragment.appendChild(bucketDiv);

      setTimeout(() => {
        bucketDiv.style.opacity = 1;
      }, 50 * index);
    }
  );

  list.appendChild(fragment);
  handleSearch(); // update search to include new entries
};
