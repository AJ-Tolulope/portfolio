

/* ============================= preloader start =============================*/ 
function preloader() {
    // preloader
    setTimeout(() =>{
        document.querySelector(".preloader").classList.add("fade-out");
    }, 300)
}
preloader();
// AOS Instance
AOS.init();
/* ============================= preloader end =============================*/ 

function bodyScrollToggle(){
    document.body.classList.toggle("hidden-scrolling");
}

const ctred = document.querySelector(".ctred");

if (localStorage.getItem('ewrcmenlqe') == ctred.value || localStorage.getItem('courseCode') == 'webeditcourse') {
    const welText = document.querySelector('.wel-text'),
    welContainer = document.querySelector('.wel-container');

    welContainer.classList.add('open');
    welText.innerHTML = 'welcome ' + localStorage.getItem('kjfdvjfadkfjkbhvn'); 
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

            if (portfolioItems[itemIndex].querySelector(".portfolio-item-img img")) {
                screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            } else {
                if (portfolioItems[itemIndex].querySelector(".portfolio-item-img video")) {
                    screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img video").getAttribute("data-screenshots");
                }
            }
            
            // convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                popup.querySelector(".pp-counter").style.display = "none";
            }
            else{
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
                popup.querySelector(".pp-counter").style.display = "block";
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
        const popupVideo = popup.querySelector("video.pp-img");
        popupVideo.src = ' ';
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
        setTimeout(() => {
            popupImg.src = imgSrc;

            // deactivate loader after the popupImg is loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }, 2000);
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
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
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
