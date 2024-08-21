document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  const revealTexts = document.querySelectorAll(".reveal-text");
  revealTexts.forEach((text) => {
    let splitText = text.innerText
      .split("")
      .map((char) => `<span class="letter">${char}</span>`)
      .join("");
    text.innerHTML = splitText;
    gsap.fromTo(
      text.querySelectorAll(".letter"),
      { opacity: 0.3 },
      {
        opacity: 1,
        stagger: 0.01,
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
      }
    );
  });
});
