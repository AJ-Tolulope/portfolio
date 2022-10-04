
/* ============================= preloader start =============================*/ 
function preloader() {
    // preloader
    setTimeout(() =>{
        document.querySelector(".preloader").classList.add("fade-out");
    }, 3000)
}
preloader();
// AOS Instance
AOS.init();
/* ============================= preloader end =============================*/ 


/* ============================= theme light and dark mode =============================*/

const dayNight = document.querySelector(".day-night");

function themeMode(){
    if(localStorage.getItem("theme") !== null){
        if(localStorage.getItem("theme") === "light-mode"){
            document.body.classList.add("light-mode");
        }
        else{
            document.body.classList.remove("light-mode");
        }
    }
    updateIcon();
}
themeMode();

dayNight.addEventListener("click", () =>{
    document.body.classList.toggle("light-mode");
    if(document.body.classList.contains("light-mode")){
        localStorage.setItem("theme", "light-mode");
    }
    else{
        localStorage.setItem("theme", "dark-mode");
    }
    updateIcon();
})
function updateIcon(){
    if(document.body.classList.contains("light-mode")){
        dayNight.querySelector("i").classList.remove("fa-sun");
        dayNight.querySelector("i").classList.add("fa-moon");
    }
    else{
        dayNight.querySelector("i").classList.remove("fa-moon");
        dayNight.querySelector("i").classList.add("fa-sun");
    }
}


/* ============================= theme color start ============================= */ 

const alternativeStyles = document.querySelectorAll(".alternate-style")

if(localStorage.getItem("color") !== null){
    changeColor();
}

function setActiveStyle(color){
    localStorage.setItem("color", color);
    changeColor();
}

function changeColor(){
    alternativeStyles.forEach((style) =>{
        if(localStorage.getItem("color") === style.getAttribute("title")){
            style.removeAttribute("disabled");
        }
        else{
            style.setAttribute("disabled", "true")
        }
    })
}
/* ============================= theme color end ============================= */ 

/* ============================= toggle style switcher =============================*/ 

const styleSwitcherToggler = document.querySelector(".style-switcher-toggler");

styleSwitcherToggler.addEventListener("click", () =>{
    document.querySelector(".style-switcher").classList.toggle("open");
})

// hide style-switcher on scroll
window.addEventListener("scroll", () =>{
    if(document.querySelector(".style-switcher").classList.contains("open")){
        document.querySelector(".style-switcher").classList.remove("open")
    }
})


function scrollTop(){
    const scrollTop = document.getElementById("move-up");

    // When the scroll is higher than 900 viewport height, add the show-move-up
    if(this.scrollY >= 900) scrollTop.classList.add("active"); else scrollTop.classList.remove("active")
}
window.addEventListener('scroll', scrollTop);
/* -------------------------- scroll top section end -----------------------------*/


/*--------------------- navigation menu start -------------------*/ 

const menuBtn = document.querySelector(".menu-btn"),
navMenu = document.querySelector(".nav-menu"),
closeNavBtn = document.querySelector(".nav-close-btn");

menuBtn.addEventListener("click", ()=>{
    showNavMenu();
});

closeNavBtn.addEventListener("click", ()=>{
    hideNavMenu();
});

function showNavMenu(){
    navMenu.classList.add("open");
    bodyScrollToggle();
};

function hideNavMenu(){
    navMenu.classList.remove("open");
    bodyScrollToggle();
};

/*--------------------- navigation menu end -------------------*/


/* -------------------------- set time start -----------------------------*/
const date = new Date(),
year = document.querySelectorAll(".year");


year.forEach((tag) =>{
    tag.innerHTML = date.getFullYear();
});

/* -------------------------- set time end -----------------------------*/


/*----------------------- attach an event handler to document -------------------*/
document.addEventListener("click", () =>{

    if(event.target.classList.contains('link-item')){
        if(event.target.hash !==""){
            event.preventDefault();
            const hash = event.target.hash;

            // deactivate existing active navigation menu 'link-item'
            navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
            navMenu.querySelector(".active").classList.remove("active", "inner-shadow");

            // if clicked 'link-item' is contained within the navigation menu
            if(navMenu.classList.contains("open")){
            
                // activate new navigation menu 'link-item'
                event.target.classList.add("active","inner-shadow");
                event.target.classList.add("active","hover-in-shadow");
                
                // hide navigation menu
                hideNavMenu();
            }
            // add hash (#) to url
            window.location.hash = hash;
        }
    }
})
/*----------------------- attach an event handler end -------------------*/


function bodyScrollToggle(){
    document.body.classList.toggle("hidden-scrolling");
}


/*----------------------- about section start -------------------------*/
const aboutSection = document.querySelector(".about-section"),
tabsContainer = document.querySelector(".about-tabs");

tabsContainer.addEventListener("click", (event) =>{
    // if event.target contains 'tab-item' class and not contains 'active' class
    if(event.target.classList.contains("tab-item") && !event.target.classList.contains("active")){
        const target = event.target.getAttribute("data-target");
        // deactivate existing active 'tab-item'
        tabsContainer.querySelector(".active").classList.remove("active");

        // activate new 'tab-items'
        event.target.classList.add("active");

        // deactivate existing active 'tab-content'
        aboutSection.querySelector(".tab-content.active").classList.remove("active");

        // activate new 'tab-conent'
        aboutSection.querySelector(target).classList.add("active");
    }
})
/*----------------------- about section start -------------------------*/