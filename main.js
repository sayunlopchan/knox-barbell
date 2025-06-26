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

// dialog
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-dialog");
  const dialog = document.getElementById("dialog");
  const closeBtns = document.querySelectorAll(".dialog-close-btn");

  function closeDialog() {
    dialog.classList.add("closing", "fade-out");

    const duration = 300; // in ms, must match animation duration
    setTimeout(() => {
      dialog.classList.add("hidden");
      dialog.classList.remove("closing", "fade-out");
    }, duration);
  }

  if (toggleBtn && dialog && closeBtns.length > 0) {
    toggleBtn.addEventListener("click", () => {
      dialog.classList.remove("hidden");
    });

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", closeDialog);
    });

    window.addEventListener("click", (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });
  } else {
    console.warn("Some dialog elements are missing in the DOM.");
  }
});
