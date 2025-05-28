async function loadCSV(url) {
  const response = await fetch(url);
  const text = await response.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data; // Returns an array of objects with keys from the header
}

let currentPage = 1;
const itemsPerPage = 6;
let allVideos = [];

function renderPage(videos, page) {
  const gallery = document.getElementById("posts");
  gallery.innerHTML = ""; // Clear previous content

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = videos.slice(start, end);
  pageItems.forEach(video => {
    const card = document.createElement('article');
    if( video.type.trim() === 'iframe'){
      card.innerHTML = `
      <article>
        <header>
          <span class="date">${video.date.trim()}</span>
            <h2>${video.title.trim()}</h2>
        </header>
          <div class="iframe-wrapper">
          <iframe src="${video.video_url.trim()}" frameborder="0" scrolling="no" allowfullscreen ></iframe>								
          </div>
        <p>${video.description.trim()}</p>
          <ul class="actions special">
            <li><a href="${video.fullStoryLink.trim()}" class="button">Full Story</a></li>
          </ul>
      </article>
      `;
    } else {
      card.innerHTML = `
      <article>
        <header>
          <span class="date">${video.date.trim()}</span>
            <h2>${video.title.trim()}</h2>
        </header>
          <video controls>
            <source src="${video.video_url.trim()}" type="video/mp4">
              Your browser does not support video playback.
          </video>									
        <p>${video.description.trim()}</p>
          <ul class="actions special">
            <li><a href="${video.fullStoryLink.trim()}" class="button">Full Story</a></li>
          </ul>
      </article>
      `;
    }
    gallery.appendChild(card);
  });
  renderPaginationControls(videos.length);
}

function renderPaginationControls(totalItems) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";

  // Prev link
  const prevLink = document.createElement("a");
  prevLink.href = "#";
  prevLink.className = "previous";
  prevLink.textContent = "Prev";
  if (currentPage === 1) prevLink.classList.add("disabled");
  prevLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderPage(allVideos, currentPage);
    }
  };
  paginationDiv.appendChild(prevLink);

  // Page number logic
  const delta = 2; // how many pages to show before/after current
  const range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }

  // Always show first
  const addPage = (i) => {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.className = "page" + (i === currentPage ? " active" : "");
    pageLink.textContent = i;
    pageLink.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      renderPage(allVideos, currentPage);
    };
    paginationDiv.appendChild(pageLink);
  };

  addPage(1);

  if (range[0] > 2) {
    const span = document.createElement("span");
    span.className = "extra";
    span.innerHTML = "&hellip;";
    paginationDiv.appendChild(span);
  }

  range.forEach(addPage);

  if (range[range.length - 1] < pageCount - 1) {
    const span = document.createElement("span");
    span.className = "extra";
    span.innerHTML = "&hellip;";
    paginationDiv.appendChild(span);
  }

  if (pageCount > 1) addPage(pageCount);

  // Next link
  const nextLink = document.createElement("a");
  nextLink.href = "#";
  nextLink.className = "next";
  nextLink.textContent = "Next";
  if (currentPage === pageCount) nextLink.classList.add("disabled");
  nextLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      renderPage(allVideos, currentPage);
    }
  };
  paginationDiv.appendChild(nextLink);

  pagination.appendChild(paginationDiv);
}

async function initGallery() {
  const allVideos = await loadCSV('video/videos.csv');
  renderPage(allVideos, currentPage);
}

initGallery();