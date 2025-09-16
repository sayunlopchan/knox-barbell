// API Base URL - Update this to match your server URL
const API_URL = `${BASE_URL}/api/ratings`;

// DOM Elements
const form = document.getElementById("ratingForm");
const reviewsList = document.getElementById("reviewsList");
const totalReviews = document.getElementById("totalReviews");
const averageRating = document.getElementById("averageRating");
const recommendPercentage = document.getElementById("recommendPercentage");

// Function to display stars based on rating value
function getStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "★" : "☆";
  }
  return stars;
}

// Function to format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Function to get a random avatar based on user name
function getAvatarUrl(name) {
  const baseUrl = `${BASE_URL}/`;
  const params = new URLSearchParams({
    name: name,
    background: "3498db",
    color: "fff",
    size: "128",
    rounded: "true",
    bold: "true",
    length: 2,
  });
  return `${baseUrl}?${params}`;
}

// Function to fetch and display approved reviews from the API
async function fetchApprovedReviews() {
  try {
    // Fetch approved reviews with stats
    const response = await fetch(`${API_URL}/approved`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reviews = data.ratings;
    const stats = data.stats;

    // Update stats from backend
    totalReviews.textContent = stats.totalReviews;
    averageRating.textContent = stats.averageRating.toFixed(1);

    // Update recommendation percentage if available
    if (stats.wouldRecommendScore !== undefined) {
      recommendPercentage.textContent = `${stats.wouldRecommendScore}%`;
    }

    // Clear loading message and remove grid class initially
    reviewsList.innerHTML = "";
    reviewsList.classList.remove("review-container");

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-inbox"></i>
                    <p>No reviews yet. Be the first to add one!</p>
                </div>
            `;
      return;
    }

    // Add grid class only when we have reviews to display
    reviewsList.classList.add("review-container");

    // Display each approved review
    reviews.forEach((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.className = "review-card";

      reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${
                          review.photo || getAvatarUrl(review.fullName)
                        }" alt="${review.fullName}" class="avatar">
                        <div class="reviewer-details">
                            <span class="reviewer-name">${
                              review.fullName
                            }</span>
                        </div>
                    </div>
                    <span class="review-date">${formatDate(
                      review.createdAt
                    )}</span>
                </div>
                <div class="review-rating">
                    ${getStarRating(review.rating)}
                </div>
                <p class="review-text">${review.review}</p>
            `;

      reviewsList.appendChild(reviewCard);
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    // Remove grid class for error message
    reviewsList.classList.remove("review-container");

    reviewsList.innerHTML = `
            <div class="message error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load reviews. Please try again later.</p>
                <p><small>Error: ${error.message}</small></p>
            </div>
        `;
  }
}

// Function to show message to user
function showMessage(message, type) {
  // Remove any existing messages
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type} form-message`;
  messageDiv.innerHTML = `<p>${message}</p>`;

  // Insert message after the form
  form.parentNode.insertBefore(messageDiv, form.nextSibling);

  // Auto-remove message after 5 seconds
  setTimeout(() => {
    if (messageDiv && messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Function to reset star rating display
function resetStarRating() {
  const starLabels = document.querySelectorAll(".star-rating label");
  starLabels.forEach((label) => {
    label.style.color = "#ddd";
  });
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const fullName = formData.get("fullName");
  const rating = parseInt(formData.get("rating"));
  const review = formData.get("review");
  const photoFile = formData.get("photo");

  // Client-side validation
  if (!fullName || fullName.trim().length < 2) {
    showMessage(
      "Please enter a valid full name (at least 2 characters).",
      "error"
    );
    return;
  }

  if (!rating || rating < 1 || rating > 5) {
    showMessage("Please select a rating between 1 and 5 stars.", "error");
    return;
  }

  if (!review || review.trim().length < 10) {
    showMessage("Please write a review with at least 10 characters.", "error");
    return;
  }

  // Validate file size and type if photo is uploaded
  if (photoFile && photoFile.name) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (photoFile.size > maxSize) {
      showMessage("Photo size should be less than 5MB.", "error");
      return;
    }

    if (!allowedTypes.includes(photoFile.type)) {
      showMessage(
        "Please upload a valid image file (JPEG, PNG, GIF, or WebP).",
        "error"
      );
      return;
    }
  }

  // Disable submit button during submission
  const submitBtn = form.querySelector(".review-btn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("fullName", fullName.trim());
    submitData.append("rating", rating);
    submitData.append("review", review.trim());

    if (photoFile && photoFile.name) {
      submitData.append("photo", photoFile);
    }

    // Submit to API
    const response = await fetch(API_URL, {
      method: "POST",
      body: submitData,
    });

    const data = await response.json();

    if (response.ok) {
      // Show success message
      showMessage(
        "Thank you! Your review has been submitted and is pending approval.",
        "success"
      );

      // Reset the form
      form.reset();
      resetStarRating();

      // Refresh reviews to show updated stats (in case it was auto-approved)
      await fetchApprovedReviews();
    } else {
      throw new Error(data.message || "Failed to submit review");
    }
  } catch (error) {
    console.error("Error submitting review:", error);

    // Show error message
    let errorMessage = "Failed to submit review. Please try again.";

    if (error.message.includes("Network")) {
      errorMessage =
        "Network error. Please check your internet connection and try again.";
    } else if (
      error.message.includes("duplicate") ||
      error.message.includes("already")
    ) {
      errorMessage =
        "You have already submitted a review. Only one review per person is allowed.";
    } else if (error.message && error.message !== "Failed to submit review") {
      errorMessage = error.message;
    }

    showMessage(errorMessage, "error");
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Initialize star rating labels
const starInputs = document.querySelectorAll(".star-rating input");
starInputs.forEach((input) => {
  input.addEventListener("change", () => {});
});

// Fetch approved reviews when page loads
document.addEventListener("DOMContentLoaded", fetchApprovedReviews);
