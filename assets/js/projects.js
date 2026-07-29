const projectGrid = document.getElementById("project-grid");
const modalRoot = document.getElementById("modal-root");
const yearElement = document.getElementById("year");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function createProjectCard(project) {
  const hasCoverImage =
    !project.placeholder &&
    project.coverImage &&
    project.coverImage.trim() !== "";

  const cover = hasCoverImage
    ? `
      <div class="project-cover">
        <span class="project-type">${escapeHtml(project.type)}</span>

        <img
          src="${escapeHtml(project.coverImage)}"
          alt="${escapeHtml(project.coverAlt || project.title)}"
          loading="lazy"
        />
      </div>
    `
    : `
      <div class="project-cover placeholder">
        <span class="project-type">${escapeHtml(project.type)}</span>
        <span>Cover image pending</span>
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
          aria-label="View ${escapeHtml(project.title)} project details"
        >
          View project
        </button>
      </div>
    </article>
  `;
}

function createSummaryItems(summary = []) {
  if (!hasItems(summary)) {
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

function createLinkButton(link, defaultPrimary = false) {
  const isPrimary = link.primary ?? defaultPrimary;
  const opensNewTab = link.newTab === true;

  return `
    <a
      class="btn ${isPrimary ? "btn-primary" : "btn-ghost"}"
      href="${escapeHtml(link.href)}"
      ${opensNewTab ? 'target="_blank" rel="noopener"' : ""}
    >
      ${escapeHtml(link.label)}
    </a>
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

  if (hasItems(project.gallery)) {
    const hasExistingPrimaryAction =
      Boolean(project.pdf) ||
      Boolean(project.presentationPdf) ||
      hasItems(project.links) ||
      hasItems(project.actions);

    buttons.push(`
      <button
        class="btn ${hasExistingPrimaryAction ? "btn-ghost" : "btn-primary"}"
        type="button"
        data-modal="gallery-${escapeHtml(project.id)}"
      >
        Photos
      </button>
    `);
  }

  /*
    Use `links` for simple custom navigation.

    Example:
    links: [
      {
        label: "Open BestBall Timeline",
        href: "bestball.html",
        primary: true
      }
    ]
  */
  if (hasItems(project.links)) {
    project.links.forEach((link) => {
      if (!link.label || !link.href) {
        return;
      }

      buttons.push(createLinkButton(link));
    });
  }

  /*
    `actions` is supported too, if you prefer that name
    in a project's data file.
  */
  if (hasItems(project.actions)) {
    project.actions.forEach((action) => {
      if (!action.label || !action.href) {
        return;
      }

      buttons.push(createLinkButton(action));
    });
  }

  return buttons.length
    ? `<div class="modal-actions">${buttons.join("")}</div>`
    : "";
}

function createProjectModal(project) {
  const hasCoverImage =
    !project.placeholder &&
    project.coverImage &&
    project.coverImage.trim() !== "";

  const hero = hasCoverImage
    ? `
      <div class="modal-hero">
        <img
          src="${escapeHtml(project.coverImage)}"
          alt="${escapeHtml(project.coverAlt || project.title)}"
        />
      </div>
    `
    : "";

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
          aria-label="Close ${escapeHtml(project.title)} details"
        >
          &times;
        </button>

        ${hero}

        <div class="modal-content">
          <p class="modal-kicker">
            ${escapeHtml(project.type)} · ${escapeHtml(project.date)}
          </p>

          <h2 id="project-${escapeHtml(project.id)}-title">
            ${escapeHtml(project.title)}
          </h2>

          <p>${escapeHtml(project.description || project.cardDescription)}</p>

          ${createSummaryItems(project.summary)}

          ${createActionButtons(project)}
        </div>
      </div>
    </div>
  `;
}

function createGalleryItem(item) {
  const source = escapeHtml(item.src);
  const alt = escapeHtml(item.alt || "");
  const caption = item.caption
    ? `<figcaption class="gallery-caption">${escapeHtml(item.caption)}</figcaption>`
    : "";

  if (item.type === "video") {
    return `
      <figure class="gallery-item">
        <video controls preload="metadata">
          <source src="${source}">
          Your browser does not support this video.
        </video>
        ${caption}
      </figure>
    `;
  }

  return `
    <figure class="gallery-item">
      <img
        src="${source}"
        alt="${alt}"
        loading="lazy"
      >
      ${caption}
    </figure>
  `;
}

function createGalleryModal(project) {
  if (!hasItems(project.gallery)) {
    return "";
  }

  const galleryItems = project.gallery
    .map(createGalleryItem)
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
          aria-label="Close ${escapeHtml(project.title)} gallery"
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

function pauseVideos(modal) {
  modal.querySelectorAll("video").forEach((video) => {
    video.pause();
  });
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

  pauseVideos(modal);

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function renderProjects() {
  if (!projectGrid || !modalRoot) {
    console.error(
      "Projects could not render. Confirm that this page includes #project-grid and #modal-root."
    );
    return;
  }

    if (typeof projects === "undefined" || !Array.isArray(projects)) {
    console.error(
      "Projects could not render. Confirm that the page data file loads before projects.js and defines `const projects = [...]`."
    );
    return;
  }

  if (!projects.length) {
    projectGrid.innerHTML = `
      <p class="empty-message">
        No projects have been added yet.
      </p>
    `;

    modalRoot.innerHTML = "";
    return;
  }

  projectGrid.innerHTML = projects
    .map(createProjectCard)
    .join("");

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

  if (modalRoot) {
    modalRoot.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        closeModal(event.target);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.is-open").forEach(closeModal);
    }
  });
}

renderProjects();
setEventListeners();

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
