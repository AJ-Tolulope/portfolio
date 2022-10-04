


function sendMail(){
    const userName = document.querySelector('.contact-form .name'),
    userEmail = document.querySelector('.contact-form .email'),
    subject = document.querySelector('.contact-form .subject'),
    body = document.querySelector('.contact-form .message');

    var link = "mailto:tolulopetimilehin124@gmail.com"
                + "?cc=" + encodeURIComponent(userEmail.value)
                + "&subject=" + encodeURIComponent(subject.value)
                + "&body=" + encodeURIComponent(body.value);

    window.location.href = link;
}