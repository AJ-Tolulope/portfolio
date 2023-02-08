


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