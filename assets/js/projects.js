const projectGrid = document.getElementById("project-grid");
const modalRoot = document.getElementById("modal-root");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createProjectCard(project) {
  const cover = project.placeholder
    ? `
      <div class="project-cover placeholder">
        <span class="project-type">${escapeHtml(project.type)}</span>
        Cover image pending
      </div>
    `
    : `
      <div class="project-cover">
        <span class="project-type">${escapeHtml(project.type)}</span>
        <img
          src="${escapeHtml(project.coverImage)}"
          alt="${escapeHtml(project.coverAlt)}"
        />
      </div>
    `;

  return `
    <article class="project-card">
      ${cover}

      <div class="project-body">
        <p class="project-date">${escapeHtml(project.date)}</p>

        <h2>${escapeHtml(project.title)}</h2>

        <p>${escapeHtml(project.cardDescription)}</p>

        <button
          class="card-button"
          type="button"
          data-modal="project-${escapeHtml(project.id)}"
        >
          View project
        </button>
      </div>
    </article>
  `;
}

function createSummaryItems(summary = []) {
  if (!summary.length) {
    return "";
  }

  return `
    <div class="project-summary">
      ${summary
        .map(
          (item) => `
            <div class="summary-item">
              <h3>${escapeHtml(item.heading)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function createActionButtons(project) {
  const buttons = [];

  if (project.pdf) {
    buttons.push(`
      <a
        class="btn btn-primary"
        href="${escapeHtml(project.pdf)}"
        target="_blank"
        rel="noopener"
      >
        View PDF
      </a>
    `);

    buttons.push(`
      <a
        class="btn btn-ghost"
        href="${escapeHtml(project.pdf)}"
        download
      >
        Download PDF
      </a>
    `);
  }

  if (project.presentationPdf) {
    buttons.push(`
      <a
        class="btn btn-ghost"
        href="${escapeHtml(project.presentationPdf)}"
        target="_blank"
        rel="noopener"
      >
        View Presentation
      </a>
    `);

    buttons.push(`
      <a
        class="btn btn-ghost"
        href="${escapeHtml(project.presentationPdf)}"
        download
      >
        Download Presentation
      </a>
    `);
  }

  if (project.gallery && project.gallery.length) {
    buttons.push(`
      <button
        class="btn ${
          project.pdf || project.presentationPdf
            ? "btn-ghost"
            : "btn-primary"
        }"
        type="button"
        data-modal="gallery-${escapeHtml(project.id)}"
      >
        Photos
      </button>
    `);
  }

  return buttons.length
    ? `<div class="modal-actions">${buttons.join("")}</div>`
    : "";
}

function createProjectModal(project) {
  const hero = project.placeholder
    ? ""
    : `
      <div class="modal-hero">
        <img
          src="${escapeHtml(project.coverImage)}"
          alt="${escapeHtml(project.coverAlt)}"
        />
      </div>
    `;

  return `
    <div
      class="modal"
      id="project-${escapeHtml(project.id)}"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-${escapeHtml(project.id)}-title"
    >
      <div class="modal-dialog">
        <button
          class="modal-close"
          type="button"
          aria-label="Close project details"
        >
          &times;
        </button>

        ${hero}

        <div class="modal-content">
          <p class="modal-kicker">${escapeHtml(project.date)}</p>

          <h2 id="project-${escapeHtml(project.id)}-title">
            ${escapeHtml(project.title)}
          </h2>

          <p>${escapeHtml(project.description)}</p>

          ${createSummaryItems(project.summary)}

          ${createActionButtons(project)}
        </div>
      </div>
    </div>
  `;
}

function createGalleryModal(project) {
  if (!project.gallery || !project.gallery.length) {
    return "";
  }

  const galleryItems = project.gallery
    .map(
      (image) => `
        <figure class="gallery-item">
          <img
            src="${escapeHtml(image.src)}"
            alt="${escapeHtml(image.alt)}"
            loading="lazy"
          />
          <figcaption class="gallery-caption">
            ${escapeHtml(image.caption)}
          </figcaption>
        </figure>
      `
    )
    .join("");

  return `
    <div
      class="modal"
      id="gallery-${escapeHtml(project.id)}"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-${escapeHtml(project.id)}-title"
    >
      <div class="modal-dialog gallery-dialog">
        <button
          class="modal-close"
          type="button"
          aria-label="Close ${escapeHtml(project.title)} photo gallery"
        >
          &times;
        </button>

        <div class="gallery-content">
          <p class="modal-kicker">${escapeHtml(project.title)}</p>

          <h2 id="gallery-${escapeHtml(project.id)}-title">Photos</h2>

          <p>Project images and additional media.</p>

          <div
            class="gallery-track"
            id="gallery-track-${escapeHtml(project.id)}"
            aria-label="${escapeHtml(project.title)} image gallery"
          >
            ${galleryItems}
          </div>

          <div class="gallery-controls" aria-label="Gallery navigation">
            <button
              class="gallery-control"
              type="button"
              data-gallery-prev="gallery-track-${escapeHtml(project.id)}"
            >
              ← Previous
            </button>

            <button
              class="gallery-control"
              type="button"
              data-gallery-next="gallery-track-${escapeHtml(project.id)}"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".modal-close");

  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function renderProjects() {
  projectGrid.innerHTML = projects.map(createProjectCard).join("");

  modalRoot.innerHTML = projects
    .map(
      (project) =>
        createProjectModal(project) +
        createGalleryModal(project)
    )
    .join("");
}

function setEventListeners() {
  document.addEventListener("click", (event) => {
    const modalButton = event.target.closest("[data-modal]");

    if (modalButton) {
      const modal = document.getElementById(modalButton.dataset.modal);
      openModal(modal);
      return;
    }

    const closeButton = event.target.closest(".modal-close");

    if (closeButton) {
      closeModal(closeButton.closest(".modal"));
      return;
    }

    const previousButton = event.target.closest("[data-gallery-prev]");

    if (previousButton) {
      const track = document.getElementById(
        previousButton.dataset.galleryPrev
      );

      if (track) {
        track.scrollBy({
          left: -track.clientWidth,
          behavior: "smooth"
        });
      }

      return;
    }

    const nextButton = event.target.closest("[data-gallery-next]");

    if (nextButton) {
      const track = document.getElementById(
        nextButton.dataset.galleryNext
      );

      if (track) {
        track.scrollBy({
          left: track.clientWidth,
          behavior: "smooth"
        });
      }
    }
  });

  modalRoot.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });
}

renderProjects();
setEventListeners();

document.getElementById("year").textContent = new Date().getFullYear();
