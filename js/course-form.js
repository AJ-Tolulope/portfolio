

function bodyScrollToggle(){
    document.body.classList.toggle("hidden-scrolling");
}

/* -------------------------- course section ----------------------------- */
(() =>{
    const courseSection = document.querySelector('.course-section'),
    courseForm = document.querySelector('.course-form'),
    formComplete = document.querySelector('.success'),
    formDenied = document.querySelector('.accessdenied'),
    submitForm = document.querySelector('.course-submit'),
    inputControl = document.querySelectorAll('.input-control'),
    ctred = document.querySelector(".ctred");

    if (document.querySelector('.course-section')) {
        bodyScrollToggle();
    }

    if (localStorage.getItem('ewrcmenlqe') == ctred.value || localStorage.getItem('courseCode') == 'webeditcourse') {
        const welText = document.querySelector('.wel-text'),
        welContainer = document.querySelector('.wel-container');

        courseSection.classList.add('hide-form');

        welContainer.classList.add('open');
        welText.innerHTML = 'welcome ' + localStorage.getItem('kjfdvjfadkfjkbhvn'); 


        bodyScrollToggle();
    }

    
    submitForm.addEventListener('click', ()=>{
        const ewrcmenlqe = document.querySelector('.ewrcmenlqe');
        const kjfdvjfadkfjkbhvn = document.querySelector('.user-name');
        
        if (ewrcmenlqe.value == ctred.value || ewrcmenlqe.value == 'webeditcourse') {
            courseForm.classList.add('hide');
            formComplete.classList.add('show');

            localStorage.setItem('ewrcmenlqe', ewrcmenlqe.value);
            localStorage.setItem('kjfdvjfadkfjkbhvn', kjfdvjfadkfjkbhvn.value);
            
            setTimeout(() => {
                courseForm.classList.add('hide');
                formComplete.classList.add('show');
                inputControl.forEach(input => {
                    input.value = '';
                });
                courseSection.classList.add('hide-form');
                bodyScrollToggle();
            }, 3000);
        } else {
            courseForm.classList.add('hide');
            formDenied.classList.add('show');

            setTimeout(() => {
                courseForm.classList.remove('hide');
                formDenied.classList.remove('show');
                inputControl.forEach(input => {
                    input.value = '';
                });
            }, 3000);

        }
    })
})();