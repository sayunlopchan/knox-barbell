// Function for Trial Form (no subject field)
async function sendTrialForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const modal = document.getElementById("emailModal");
  const modalContent = document.getElementById("modalContent");

  modal.style.display = "flex";

  // Show spinner/loading
  modalContent.innerHTML = `
    <div class="spinner"></div>
    <p class="modal-status-text">Sending trial request...</p>
  `;

  const data = {
    firstName: formData.get("FN"),
    lastName: formData.get("LN"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: "Free Trial", // Auto-generated subject for trial
    message: "Trial membership request - 2 weeks trial membership signup",
  };

  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();

    // Success message
    modalContent.innerHTML = `
      <div class="success-icon">✓</div>
      <p class="modal-status-text success-text">Trial request sent successfully!</p>
    `;

    form.reset();

    setTimeout(() => {
      modal.style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("Error sending trial request:", error);

    // Error message
    modalContent.innerHTML = `
      <div class="error-icon">X</div>
      <p class="modal-status-text error-text">Failed to send trial request. Please try again.</p>
      <button onclick="document.getElementById('emailModal').style.display='none'">Close</button>
    `;
  }
}
