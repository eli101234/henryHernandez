
const learnMoreBtn = document.getElementById('learnMoreBtn');
learnMoreBtn.addEventListener('click', () => {
    document.querySelector('.hero-container').classList.add('reveal');
    document.querySelector('.header').classList.add('reveal');
    document.querySelector('.btn.secondary').classList.add('hidden');
    //document.querySelector('.btn.primary').classList.add('move');
    
});
learnMoreBtn.addEventListener('transitionend', () =>{
    document.querySelector('.btn.secondary.hidden').classList.add('gone');
})