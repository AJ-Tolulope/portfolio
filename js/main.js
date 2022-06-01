
/* ============================= preloader start =============================*/ 
window.addEventListener("load", () =>{
    // preloader
    document.querySelector(".preloader").classList.remove("fade-out");
    setTimeout(() =>{
        document.querySelector(".preloader").classList.add("fade-out");
    }, 100)
});

// AOS Instance
AOS.init();
/* ============================= preloader end =============================*/ 

/* ============================= theme light and dark mode =============================*/

const dayNight = document.querySelector(".day-night");

function themeMode(){
    if(localStorage.getItem("theme") !== null){
        if(localStorage.getItem("theme") === "dark"){
            document.body.classList.add("dark");
        }
        else{
            document.body.classList.remove("dark");
        }
    }
    updateIcon();
}
themeMode();

dayNight.addEventListener("click", () =>{
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
    }
    else{
        localStorage.setItem("theme", "light");
    }
    updateIcon();
})
function updateIcon(){
    if(document.body.classList.contains("dark")){
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


/* -------------------------- sccroll top section start -----------------------------*/
// $(document).ready(function () {

//     // click to scroll top
//     $('.move-up span').click(function () {
//         $('html, body').animate({
//             scrollTop: 0
//         }, 1000);
//     })
// });

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
            // //  deactivate existing active section
            // document.querySelector(".section.active").classList.add("hide");
            // document.querySelector(".section.active").classList.remove("active");

            // // activate new section
            // document.querySelector(hash).classList.add("active");
            // document.querySelector(hash).classList.remove("hide");

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
            else{
                let navItems = navMenu.querySelectorAll(".link-item");
                navItems.forEach((item) =>{
                    if(hash === item.hash){
                        // activate new navigation menu 'link-item'
                        item.classList.add("active","inner-shadow");
                        item.classList.add("active","hover-in-shadow");
                    }
                })
                fadeOutEffect();
            }
            // add hash (#) to url
            window.location.hash = hash;
        }
    }
})
/*----------------------- attach an event handler end -------------------*/


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


function bodyScrollToggle(){
    document.body.classList.toggle("hidden-scrolling");
}


/*---------------------- portfolio filter page ----------------------*/

(() =>{
    
    const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = document.querySelector(".pp-prev"),
    nextBtn = document.querySelector(".pp-next"),
    closeBtn = document.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");

    let itemIndex, slideIndex, screenshots;

    // filter portfolio items
    filterContainer.addEventListener("click", (event) =>{
        if(event.target.classList.contains("filter-item") && !event.target.classList.contains("active")){
            // deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("active");

            // activate new 'filter-items'
            event.target.classList.add("active");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) =>{
                if (target === item.getAttribute("data-category") || target === "all"){
                    item.classList.remove("hide");
                    item.classList.add("show");

                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;

            // get the portfolioItem index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            
            // convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
            else{
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails() 

        }
    })
    
    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle(){
        popup.classList.toggle("open");
        bodyScrollToggle();
    }

    function popupSlideshow(){
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");

        // activate loader until the popupImg load
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () =>{
            // deactivate loader after the popupImg is loaded
            popup.querySelector(".pp-loader").classList.remove("active")
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;

    }

    // next slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })

    // prev slide
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length - 1;
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })
    
    function popupDetails(){
        projectDetailsBtn.style.display = "block";

        // get the project details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;

        // set the project details
        popup.querySelector(".pp-project-details").innerHTML = details;

        // get the project title
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;

        // set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;

        // get the project category
        const category = portfolioItems[itemIndex].getAttribute("data-category");

        // set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }
    projectDetailsBtn.addEventListener("click", () =>{
        popupDetailsToggle()
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");

            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        } 
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");

            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }
})();


/* -------------------------- testimonial section -----------------------------*/

(() =>{
    const sliderContainer = document.querySelector(".testi-slider-container"),
    slides = sliderContainer.querySelectorAll(".testi-item"),
    prevBtn = document.querySelector(".testi-slider-nav .prev"),
    nextBtn = document.querySelector(".testi-slider-nav .next"),
    activeSlide = sliderContainer.querySelector(".testi-item.active")
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);
    
    // next slide effect
    nextBtn.addEventListener("click", ()=>{
        if(slideIndex === slides.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        slider(); 
    })


    // prev slide effect 
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){ 
            slideIndex = slides.length-1;
        }
        else{
            slideIndex--;
        }
        slider();
    })

    // make each slide display none after deactivation
    function slider(){
        // deactivate existing active slides 
        sliderContainer.querySelector(".testi-item.active").classList.remove("active")

        // activate new slide 
        slides[slideIndex].classList.add("active");
    }
    slider();

})();


