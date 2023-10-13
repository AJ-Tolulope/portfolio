/* ============================= theme color start ============================= */

const alternativeStyles = document.querySelectorAll(".alternate-style");

const colorStyle = ["color-1", "color-2", "color-3", "color-4", "color-5"];

var colorCounter = 0;

setInterval(() => {
  setColorStyle(colorCounter);
}, 30000);

function setColorStyle(counter) {
  if (counter <= 4) {
    const color = colorStyle[counter];

    // loop through all alternativeStyles (link tag)
    alternativeStyles.forEach((style) => {
      if (color === style.getAttribute("title")) {
        // disable if the attribute matches the color
        style.removeAttribute("disabled");
      } else {
        // set disabled attribute to the rest
        style.setAttribute("disabled", "true");
      }
    });

    colorCounter = colorCounter + 1;

    // reset counter
    if (counter == 4) {
      colorCounter = 0;
    }
  }
}

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
