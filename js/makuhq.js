

(function() {
    emailjs.init("kSzE7PK8hLVLhRQGh");
})();


function sendMail(){
    
  const userName = document.querySelector('.contact-form .name'),
  userEmail = document.querySelector('.contact-form .email'),
  subject = document.querySelector('.contact-form .subject'),
  body = document.querySelector('.contact-form .message');

  var atpos = userEmail.value.indexOf('@');
  var dotpos = userEmail.value.lastIndexOf('.');

  if (atpos < 1 || (dotpos - atpos < 2)) {
    alert("Please enter correct email id");
    userEmail.focus();
  }

  document.querySelectorAll('.input-control').forEach(input => {
    if(input.value !== ''){
        var templateParams = {
          to_name: 'WEBEDIT',
          from_name: userName.value,
          user_email: userEmail.value,
          subject: subject.value,
          message: body.value
        };
        
        emailjs.send("service_5z8asbm", "template_soq8rxc", templateParams)
        .then(function(response) {
          alert('Your message has been sent successfully', response.status, response.text);
        }, function(error) {
          alert('Failed to send message...', error);
        });
        userName.value = ''
        userEmail.value = ''
        subject.value = ''
        body.value = ''
    } else{
      input.focus();
    }
    
  });
  
  
};
