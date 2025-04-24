// import { handleSearch } from "./handleSearch.js";
import { removeEmojis, cleanCustomFieldValue } from "./domHelpers.js";
import { Rating } from "./rating.js";
import { DREAMS_URL } from "./config.js";

export function renderBuckets(bucketsToRender) {
  const list = document.getElementById("buckets-list");
  const urlBase = DREAMS_URL;
  const fragment = document.createDocumentFragment();
  const rating = new Rating();

  bucketsToRender.forEach((bucket, index) => {
    const {
      id: bucketId,
      title,
      summary,
      noOfFunders,
      noOfComments,
      percentageFunded,
      percentageFundedTrue,
      funded,
      income,
      minGoal,
      maxGoal,
      images,
      customFields,
    } = bucket;

    const ratingValue = rating.get(bucketId);

    const div = document.createElement("div");
    div.className = "bucket";
    div.dataset.rating = ratingValue;
    div.dataset.bucketId = bucketId;

    const customFieldsHTML = customFields
      .filter(
        ({ customField }) => customField?.name?.toLowerCase() === "description"
      )
      .map(
        ({ customField, value }) =>
          `<p><strong>${
            customField?.name || "Unnamed Field"
          }:</strong> ${cleanCustomFieldValue(value)}</p>`
      )
      .join("");

    const coverImage = images[0]?.small || "";
    const imagesHTML =
      images.length > 1
        ? images
            .slice(1)
            .map((img) => `<img loading="lazy" src="${img.small}" alt="${title} image" />`)
            .join("")
        : "";

    const cleanTitle = removeEmojis(title || "");
    const cleanSummary = removeEmojis(summary || "");

    div.innerHTML = `
      <header>
        <h3><a href="${urlBase}/${bucketId}" target="_blank">${cleanTitle}</a></h3>
        <sl-rating class="rating" label="Rating" value="${ratingValue}"></sl-rating>
      </header>
      <main>
        <img class="cover" src="${coverImage}">
        <p>${cleanSummary || "N/A"}</p>
        <div class="custom-fields">
          ${customFieldsHTML || "<p>No custom fields found.</p>"}
        </div>
        ${imagesHTML}
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
            <div class="progress" style="width: ${percentageFundedTrue}%"></div>
          </div>
          <p>${percentageFundedTrue}%</p>
        </div>
        <div class="goals">
          <p><strong>Min Goal:</strong> ${minGoal}</p>
          <p><strong>Max Goal:</strong> ${maxGoal}</p>
        </div>
      </footer>
    `;

    div.querySelector(".rating").addEventListener("sl-change", (e) => {
      const newRating = e.target.value;
      rating.set(newRating, bucketId);
      div.dataset.rating = newRating;
    });

    fragment.appendChild(div);
  });

  list.appendChild(fragment);
}
