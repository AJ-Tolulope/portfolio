

(function() {
    emailjs.init("kSzE7PK8hLVLhRQGh");
})();


function sendUser(){
    
    const userName = document.querySelector('.course-form .user-name'),
    lastName = document.querySelector('.course-form .last-name'),
    userEmail = document.querySelector('.course-form .email'),
    userGithub = document.querySelector('.course-form .github');

    var templateParams = {
    to_name: 'WEBEDIT',
    first_name: userName.value,
    full_name: userName.value + ' ' + lastName.value,
    user_email: userEmail.value,
    user_github: userGithub.value
    };

    emailjs.send("service_5z8asbm", "template_gxfxgnb", templateParams)
    .then(function(response) {
        alert('Success! Your message has been sent', response.status, response.text);
    }, function(error) {
        alert('Failed to send message...', error);
    });
};
