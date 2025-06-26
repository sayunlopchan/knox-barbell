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
