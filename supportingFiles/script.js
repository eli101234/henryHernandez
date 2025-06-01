const learnMoreBtn = document.getElementById('learnMoreBtn');
learnMoreBtn.addEventListener('click', () => {
  document.querySelector('.hero-container')?.classList.add('reveal');
  document.querySelector('.header')?.classList.add('reveal');
  document?.querySelector('.btn.learnMore')?.classList?.add('hidden');
});
learnMoreBtn.addEventListener('transitionend', () => {
  document.querySelector('.btn.learnMore.hidden')?.classList.add('gone');
  syncPosition();
});

gsap.registerPlugin(ScrollTrigger);

gsap.from('.scroll-image', {
  scrollTrigger: {
    trigger: '.scroll-image',
    start: 'top 80%', // When image top hits 80% of viewport
    toggleActions: 'play none none none',
  },
  y: 50,
  opacity: 0,
  duration: 1,
});

function syncPosition() {
  if (document.querySelector('.hero-container.reveal')) {
    const box1 = document.querySelector('.buttons');
    const box2 = document.querySelector('.more-info');
    const rect = box1.getBoundingClientRect();
    box2.style.top = `${rect.bottom - 10}px`; // e.g., place it below box1
    box2.style.height = '85%';
    box2.style.opacity = '1';
    box2.style.filter = 'blur(0)';
  }
}

// https://www.voanews.com/s?k=Henry+Hernandez
// https://www.instagram.com/reel/C-4ieE8vnBx/
// https://www.instagram.com/reel/C-1lmVAtGDy/
// https://www.instagram.com/reel/C-9ommDIbJa/
// https://www.instagram.com/reel/DBUUg6-Nx71/
// https://www.instagram.com/reel/C-_JhAnKty-/
// https://www.voanews.com/a/vice-president-elect-credits-grandmother-kentucky-roots/7939310.html
// https://www.voanews.com/a/us-border-patrol-says-message-is-southern-border-is-not-open-/7824827.html
// https://www.voanews.com/a/quick-changes-expected-by-president-elect-trump-/7864089.html
// https://www.voanews.com/a/near-us-mexico-border-immigrants-take-final-steps-toward-citizenship-with-community-support/7826160.html
// https://www.voanews.com/a/former-president-trump-beats-former-un-ambassador-haley-in-her-state-/7501648.html
