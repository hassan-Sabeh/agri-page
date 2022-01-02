console.log(businessCount);
const paginationEl = document.querySelector(".pagination");
const previousPageEl = document.querySelector("#previous-page");
const nextPageEl = document.querySelector("#next-page");
const favoritesEl = document.querySelector('#favorites');
const editEl = document.querySelector('#edit');
const logoutEl = document.querySelector('#logout');
const businessCardEl = document.querySelector('#business-card');

//previousPageEl.href = '#';
favoritesEl.addEventListener('click', event => {
    window.location.href = '/profile/favorites';
});
editEl.addEventListener('click', event => {
    window.location.href = '/profile/edit';
});

logoutEl.addEventListener('click', event => {
    window.location.href = '/profile/logout';
});


const paramsString = window.location.search;
let searchParams = new URLSearchParams(paramsString);
let currentPageNumber = parseInt(searchParams.get('page'));
if (!currentPageNumber || currentPageNumber === 1 ){
    previousPageEl.href = ``;
    nextPageEl.href = `/profile?page=${2}`;    
} else {
    previousPageEl.href = `/profile?page=${currentPageNumber - 1}`;
    nextPageEl.href = `/profile?page=${currentPageNumber + 1}`;
}


for (let i =1; i<=businessCount; i++) {
    var pageNumber = document.createElement('a');
    paginationEl.appendChild(pageNumber);
    pageNumber.textContent = i;
    pageNumber.style.cursor = "pointer";
    pageNumber.href = `/profile?page=${i}`
    if (i === currentPageNumber) {
        pageNumber.classList.add('active');
    }
}

paginationEl.appendChild(nextPageEl);
