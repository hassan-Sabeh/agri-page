const favoritesEl = document.querySelector('#favorites');
const editEl = document.querySelector('#edit');
const logoutEl = document.querySelector('#logout');
const exploreEl = document.querySelector('#explore');
const deleteEl = document.querySelector('.delete-img');

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

exploreEl.addEventListener('click', event => {
    window.location.href = '/profile';
});

deleteEl.addEventListener('click', event => {
    window.location.href = '/profile/favorites?operation=delete';
});
