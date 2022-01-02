const loginBox = document.querySelector("#login-box");
const signUpBox = document.querySelector("#signup-box");

loginBox.addEventListener('click', event => {
        window.location.href = '/login';
});

signUpBox.addEventListener('click', event => {
    window.location.href = '/signuptransition';
});