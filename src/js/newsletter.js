async function subscribeNewsletter(event) {
  event.preventDefault(); // Prevent form refresh

  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value.trim();

  const modal = document.getElementById("newsletterModal");
  const modalContent = document.getElementById("newsletterModalContent");
  modal.style.display = "flex";

  // Show loading spinner
  modalContent.innerHTML = `
    <div class="spinner"></div>
    <p class="modal-status-text">Subscribing...</p>
  `;

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    modalContent.innerHTML = `
      <div class="error-icon">X</div>
      <p class="modal-status-text error-text">Please enter a valid email address.</p>
      <button onclick="closeNewsletterModal()">Close</button>
    `;
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to subscribe.");
    }

    const result = await response.json();

    modalContent.innerHTML = `
      <div class="success-icon">✓</div>
      <p class="modal-status-text success-text">Subscribed successfully!</p>
    `;

    emailInput.value = "";

    // Auto-close modal after 2 seconds
    setTimeout(() => {
      modal.style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("Subscription error:", error);
    modalContent.innerHTML = `
      <div class="error-icon">X</div>
      <p class="modal-status-text error-text">Subscription failed. Please try again.</p>
      <button onclick="closeNewsletterModal()">Close</button>
    `;
  }
}

function closeNewsletterModal() {
  document.getElementById("newsletterModal").style.display = "none";
}
