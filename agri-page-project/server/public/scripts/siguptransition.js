const clientSelection  = document.querySelector(".client");
const farmerSelection = document.querySelector(".farmer");

clientSelection.addEventListener('click', even => {
    window.location.href = '/signup?user=client';
});

farmerSelection.addEventListener('click', even => {
    window.location.href = '/signup?user=farmer';
});

