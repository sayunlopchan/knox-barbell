const hamburger = document.querySelector(".hamburger");
const slidebar = document.querySelector(".slidebar");
const bgOverlay = document.querySelector(".slide-bg-overlay");
let isSlidebarOpen = false;

// Toggle slidebar on hamburger click
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  if (isSlidebarOpen) {
    closeSlidebar();
  } else {
    openSlidebar();
  }
});

function openSlidebar() {
  slidebar.style.transform = "translateX(0)";
  bgOverlay.style.display = "block";
  document.body.classList.add("no-scroll"); // disable scroll
  isSlidebarOpen = true;
}

function closeSlidebar() {
  slidebar.style.transform = "translateX(100%)";
  bgOverlay.style.display = "none";
  document.body.classList.remove("no-scroll"); // re-enable scroll
  isSlidebarOpen = false;
}

// Close slidebar if clicked outside
document.addEventListener("click", (e) => {
  if (
    isSlidebarOpen &&
    !slidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeSlidebar();
  }
});

// FAQ
const faqs = [
  {
    question: "What are your gym opening hours?",
    answer: "We are open from 5 AM to 10 PM, Monday to Sunday.",
  },
  {
    question: "Do you offer personal training?",
    answer: "Yes, we have certified trainers available for personal sessions.",
  },
  {
    question: "Is there a trial period?",
    answer: "Yes, we offer a 3-day free trial for new members.",
  },
  {
    question: "What amenities are included with membership?",
    answer:
      "All memberships include access to showers, lockers, Wi-Fi, and group classes.",
  },
];

const faqList = document.querySelector(".faq-list");
let currentlyOpenFaq = null; // Track which FAQ is currently open

faqs.forEach((faq, index) => {
  const faqItem = document.createElement("div");
  faqItem.classList.add("faq-item");

  faqItem.innerHTML = `
      <div class="faq-question">
        <h3>${faq.question}</h3>
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `;

  const question = faqItem.querySelector(".faq-question");
  const answer = faqItem.querySelector(".faq-answer");
  const icon = faqItem.querySelector("i");

  question.addEventListener("click", () => {
    // If this FAQ is already open, close it
    if (faqItem.classList.contains("open")) {
      faqItem.classList.remove("open");
      icon.style.transform = "rotate(0deg)";
      answer.style.maxHeight = null;
      currentlyOpenFaq = null;
      return;
    }

    // Close the currently open FAQ (if any)
    if (currentlyOpenFaq) {
      currentlyOpenFaq.classList.remove("open");
      currentlyOpenFaq.querySelector("i").style.transform = "rotate(0deg)";
      currentlyOpenFaq.querySelector(".faq-answer").style.maxHeight = null;
    }

    // Open the clicked FAQ
    faqItem.classList.add("open");
    icon.style.transform = "rotate(90deg)";
    answer.style.maxHeight = answer.scrollHeight + "px";
    currentlyOpenFaq = faqItem;
  });

  faqList.appendChild(faqItem);
});
