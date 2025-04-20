import { handleSearch } from "./handleSearch.js";
import { removeEmojis, cleanCustomFieldValue } from "./domHelpers.js";
import { renderRatingUI, getRating } from "./rating.js";
import { DREAMS_URL } from "./config.js";

export function renderBuckets(bucketsToRender) {
  const list = document.getElementById("buckets-list");
  const urlBase = DREAMS_URL;
  const fragment = document.createDocumentFragment();

  bucketsToRender.forEach((bucket, index) => {
    const {
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
    } = bucket;

    const div = document.createElement("div");
    div.className = "bucket";
    div.dataset.rating = getRating(id);

    const customFieldsHTML = customFields
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
            .map((img) => `<img src="${img.small}" alt="${title} image" />`)
            .join("")
        : "";

    const cleanTitle = removeEmojis(title || "");
    const cleanSummary = removeEmojis(summary || "");
    const incomeCents = income / 100;
    const minCents = minGoal / 100;
    const maxCents = maxGoal / 100;
    const funded = Math.round(
      minCents * (percentageFunded / 100) - incomeCents
    );
    const percentageFunded2 = ((funded / minCents) * 100).toFixed(2);
    const ratingUI = renderRatingUI(id, 0);

    div.innerHTML = `
      <header>
        <h3><a href="${urlBase}/${id}">${cleanTitle}</a></h3>
        <div class="rating-placeholder"></div>
      </header>
      <main>
        <img class="cover" src="${coverImage}">
        <p>${cleanSummary || "N/A"}</p>
        <div class="custom-fields">
          ${customFieldsHTML || "<p>No custom fields found.</p>"}
        </div>
        ${imagesHTML}
      </main>
      <footer style="display:none">
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

    div.querySelector(".rating-placeholder").appendChild(ratingUI);
    fragment.appendChild(div);

    setTimeout(() => {
      div.style.opacity = 1;
    }, 50 * index);
  });

  list.appendChild(fragment);
}
