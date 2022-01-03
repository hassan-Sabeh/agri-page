const likeEl = document.querySelector('#add-favorites');

likeEl.addEventListener('click', event => {
    likeEl.style.backgroundColor = '#DE563E';
    likeEl.textContent = "added to favorites";
});

