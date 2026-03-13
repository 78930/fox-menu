'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});



/**
 * BOOKING FORM SUBMISSION
 */

// EmailJS configuration: set values via meta tags in index.html or via window.APP_CONFIG
// Examples (in <head>):
// <meta name="emailjs-public" content="YOUR_PUBLIC_KEY">
// <meta name="emailjs-service" content="YOUR_SERVICE_ID">
// <meta name="emailjs-template" content="YOUR_TEMPLATE_ID">
const EMAILJS_PUBLIC_KEY = (document.querySelector('meta[name="emailjs-public"]') || {}).content || (window.APP_CONFIG && window.APP_CONFIG.EMAILJS_PUBLIC_KEY) || "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = (document.querySelector('meta[name="emailjs-service"]') || {}).content || (window.APP_CONFIG && window.APP_CONFIG.EMAILJS_SERVICE_ID) || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = (document.querySelector('meta[name="emailjs-template"]') || {}).content || (window.APP_CONFIG && window.APP_CONFIG.EMAILJS_TEMPLATE_ID) || "YOUR_TEMPLATE_ID";

emailjs.init(EMAILJS_PUBLIC_KEY);

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const name = document.querySelector("input[name='name']").value;
    const phone = document.querySelector("input[name='phone']").value;
    const person = document.querySelector("select[name='person']").value;
    const date = document.querySelector("input[name='reservation-date']").value;
    const time = document.querySelector("select[name='time']").value;
    const message = document.querySelector("textarea[name='message']").value;

    // Validate form
    if (!name || !phone || !date || !time) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare message
    const bookingMessage = `
Name: ${name}
Phone: ${phone}
Number of Persons: ${person}
Reservation Date: ${date}
Time: ${time}
Message: ${message || "No message"}
    `.trim();

    // Prepare payload for backend (if used)
    const payload = {
      name,
      phone,
      person,
      reservation_date: date,
      reservation_time: time,
      message
    };

    // Determine whether to POST to a backend endpoint
    const USE_BACKEND = (document.querySelector('meta[name="use-backend"]') || {}).content === 'true' || (window.APP_CONFIG && window.APP_CONFIG.USE_BACKEND);
    const BACKEND_ENDPOINT = (document.querySelector('meta[name="backend-endpoint"]') || {}).content || (window.APP_CONFIG && window.APP_CONFIG.BACKEND_ENDPOINT) || '/api/book';

    if (USE_BACKEND) {
      fetch(BACKEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Server error');
          // Open WhatsApp and reset form
          const whatsappMessage = encodeURIComponent(`Hello! I would like to make a booking.\n\n${bookingMessage}`);
          const whatsappUrl = `https://wa.me/918885653460?text=${whatsappMessage}`;
          alert("Booking request sent! You'll be redirected to WhatsApp to confirm.");
          window.open(whatsappUrl, "_blank");
          bookingForm.reset();
        })
        .catch((error) => {
          console.error('Error posting to backend:', error);
          alert('Error sending booking request. Please try again or call us directly.');
        });
      return;
    }

    // Send email via EmailJS (fallback)
    const templateParams = {
      to_email: "booking@foxstoriescafe.com",
      from_name: name,
      from_phone: phone,
      booking_details: bookingMessage,
      person_count: person,
      reservation_date: date,
      reservation_time: time,
      message: message
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log("Email sent successfully", response);
        // Send WhatsApp message
        const whatsappMessage = encodeURIComponent(
          `Hello! I would like to make a booking.\n\n${bookingMessage}`
        );
        const whatsappUrl = `https://wa.me/918885653460?text=${whatsappMessage}`;
        // Show success message
        alert("Booking request sent! You'll be redirected to WhatsApp to confirm.");
        // Open WhatsApp
        window.open(whatsappUrl, "_blank");
        // Reset form
        bookingForm.reset();
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending booking request. Please try again or call us directly.");
      });
  });
}