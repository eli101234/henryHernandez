const folders = ['gradPhotos']; // Add your folder names here
const folderToTitle = {
  gradPhotos: 'Graduation Photoshoot',
};
const cloudFunctionURL =
  'https://us-central1-spheric-gasket-461401-a7.cloudfunctions.net/listImages';

folders.forEach((folder) => {
  fetch(`${cloudFunctionURL}?folder=${folder}`)
    .then((res) => res.json())
    .then((urls) => {
      if (!urls.length) return;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <h2 style="text-align:center;">${folderToTitle[folder].toUpperCase()}</h2>
        <div id="slideshow-${folder}" class="slideshow loading" style="position:relative;height:400px;"></div>
        <div class="controls">
          <button onclick="prevSlide('${folder}')">⏮ Prev</button>
          <button id="btn-${folder}" onclick="toggleSlideshow('${folder}')">⏸ Pause</button>
          <button onclick="nextSlide('${folder}')">⏭ Next</button>
        </div>
      `;
      document.getElementById('slideshows').appendChild(wrapper);

      initSlideshow(folder, urls);
    });
});

const slideshows = {};

function initSlideshow(folder, imageUrls) {
  const container = document.getElementById(`slideshow-${folder}`);

  slideshows[folder] = {
    index: 0,
    timer: null,
    images: [],
    urls: imageUrls, // store all urls for lazy loading
  };

  imageUrls.forEach((url, i) => {
    const img = document.createElement('img');
    img.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0;
      transition: opacity 1s;
      pointer-events: none;
    `;

    img.addEventListener('click', () => openLightbox(url));

    // Only eagerly load the first 2 images, defer the rest
    if (i < 2) {
      img.src = url;
    } else {
      img.dataset.src = url;
    }

    // When the first image loads, remove the spinner and show it
    if (i === 0) {
      img.addEventListener('load', () => {
        container.classList.remove('loading');
        img.style.opacity = 1;
        img.style.pointerEvents = 'auto';
      });
    }

    container.appendChild(img);
    slideshows[folder].images.push(img);
  });

  slideshows[folder].timer = setInterval(() => nextSlide(folder), 5000);
}

function showSlide(folder, index) {
  const data = slideshows[folder];

  data.images.forEach((img, i) => {
    const isActive = i === index;
    img.style.opacity = isActive ? 1 : 0;
    img.style.pointerEvents = isActive ? 'auto' : 'none';
  });

  // Preload the next image if it hasn't been loaded yet
  const nextIndex = (index + 1) % data.images.length;
  const nextImg = data.images[nextIndex];
  if (nextImg.dataset.src) {
    nextImg.src = nextImg.dataset.src;
    delete nextImg.dataset.src;
  }
}

function nextSlide(folder) {
  const data = slideshows[folder];
  data.index = (data.index + 1) % data.images.length;
  showSlide(folder, data.index);
  resetSlideshowTimer(folder);
}

function prevSlide(folder) {
  const data = slideshows[folder];
  data.index = (data.index - 1 + data.images.length) % data.images.length;
  showSlide(folder, data.index);
  resetSlideshowTimer(folder);
}

function resetSlideshowTimer(folder) {
  const data = slideshows[folder];
  if (data.timer) {
    clearInterval(data.timer);
  }
  data.timer = setInterval(() => nextSlide(folder), 5000);
  const btn = document.getElementById(`btn-${folder}`);
  if (btn) btn.textContent = '⏸ Pause';
}

function toggleSlideshow(folder) {
  const data = slideshows[folder];
  const btn = document.getElementById(`btn-${folder}`);
  if (data.timer) {
    clearInterval(data.timer);
    data.timer = null;
    btn.textContent = '▶ Play';
  } else {
    data.timer = setInterval(() => nextSlide(folder), 5000);
    btn.textContent = '⏸ Pause';
  }
}

function openLightbox(imageUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = imageUrl;
  lightbox.style.display = 'flex';

  for (const folder in slideshows) {
    const data = slideshows[folder];
    if (data.timer) {
      clearInterval(data.timer);
      data.timer = null;
      const btn = document.getElementById(`btn-${folder}`);
      if (btn) btn.textContent = '▶ Play';
    }
  }
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';

  for (const folder in slideshows) {
    const data = slideshows[folder];
    if (!data.timer) {
      data.timer = setInterval(() => nextSlide(folder), 5000);
      const btn = document.getElementById(`btn-${folder}`);
      if (btn) btn.textContent = '⏸ Pause';
    }
  }
}

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    closeLightbox();
  }
});