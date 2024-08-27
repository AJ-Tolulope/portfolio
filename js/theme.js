// theme update

const themeIcon = document.querySelector(".theme");

// set the icon and theme
const icon = themeIcon.querySelector("i");

if (localStorage.getItem("icon") === "fa-sun") {
  icon.classList.replace("fa-moon", "fa-sun");
  document.querySelector("body").classList.add("light-mode");
}

themeIcon.addEventListener("click", () => {
  document.querySelector("body").classList.toggle("light-mode");

  updateIcon();
});

function updateIcon() {
  if (icon.classList.contains("fa-moon")) {
    icon.classList.replace("fa-moon", "fa-sun");

    localStorage.setItem("icon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");

    localStorage.setItem("icon", "fa-moon");
  }
}
/* ============================= theme color end ============================= */
