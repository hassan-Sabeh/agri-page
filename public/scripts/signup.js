const businessSection = document.querySelector("#business-information");
const personalSection = document.querySelector("#personal-information");
const formEl = businessSection.parentElement;

if (userType === "client") {
    // businessSection.style.visibility = "hidden";
    formEl.removeChild(businessSection);
    formEl.style.width = "30%";
    personalSection.style.width = "100%";
}

if (errorMessage) {
    alert(errorMessage);
}

