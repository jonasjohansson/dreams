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
            .map(
              (img) =>
                `<img loading="lazy" src="${img.small}" alt="${title} image" />`
            )
            .join("")
        : "";

    const cleanTitle = removeEmojis(title || "");
    const cleanSummary = removeEmojis(summary || "");

    div.innerHTML = `
      <header>
          <div class="title-row">
          <sl-tooltip content="${cleanTitle}">
            <h2><a href="${urlBase}/${bucketId}" target="_blank">${cleanTitle}</a></h2>
          </sl-tooltip>
            <sl-rating class="rating" label="Rating" value="${ratingValue}"></sl-rating>
          </div>
          <div class="info-row">
            <div class="goals">
              <span><strong>Goal:</strong> ${minGoal}–${maxGoal}</span>
            </div>
            <div class="progress-bar-container">
              <sl-progress-bar value="${
                percentageFundedTrue > 100 ? 100 : percentageFundedTrue
              }">
                <span>${percentageFundedTrue}%</span>
              </sl-progress-bar>
            </div>
            <p class="funders-comments">
              <span class="icon funder-icon">💰</span>
              <span>${noOfFunders}</span>
              <sl-tooltip content="View comments">
                <a href="${urlBase}/${bucketId}?tab=comments" class="comment-link">
                  <span class="icon comment-icon">💬</span>
                  <span>${noOfComments}</span>
                </a>
              </sl-tooltip>
            </p>
          </div>
      </header>
      <main>
        <img class="cover" src="${coverImage}">
        <details>
          <summary>
            ${cleanSummary || "N/A"}
          </summary>
          <br>
          <div class="custom-fields">
            ${customFieldsHTML || "<p>No custom fields found.</p>"}
          </div>
          <br>
          ${imagesHTML}
        </details>
      </main>
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
