// index.html  event section
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("eventCardsContainer");
  if (!container) return; // ❌ If container not found, stop running

  fetch(`${BASE_URL}/api/events`)
    .then((response) => response.json())
    .then((data) => {
      const events = data.docs;

      if (!Array.isArray(events)) {
        throw new Error("Events data is not an array");
      }

      if (events.length === 0) {
        container.innerHTML = `
          <div class="no-event-card">
            <div class="no-event-content">
              <h2>No Upcoming Events</h2>
              <p>Please check back later!</p>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = events
        .map((event) => {
          const startDateObj = new Date(event.startTime);
          const endDateObj = new Date(event.endTime);

          const formattedDate = `${startDateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })} - ${endDateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}`;

          const formattedTime = `${startDateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })} - ${endDateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;

          const description = event.description?.join(" ") || "";

          return `
            <div class="event-card">
              <div class="event-card-header">
                <h3>${event.title}</h3>
                <div class="event-location">
                  <p>LOCATION</p>
                  <p>${event.location}</p>
                </div>
              </div>
              <div class="event-card-details">
                <p><strong>DATE:</strong> <span>${formattedDate}</span></p>
                <p><strong>TIME:</strong> <span>${formattedTime}</span></p>
                <p>${description}</p>
              </div>
              <div class="event-card-footer">
                <button class="btn-secondary">JOIN EVENT</button>
              </div>
            </div>
          `;
        })
        .join("");
    })
    .catch((error) => {
      console.error("Failed to fetch events:", error);
      container.innerHTML = `<p>Unable to load events at this time. Please try again later.</p>`;
    });
});

// event.html event card
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".upcoming-events-list");
  if (!container) return;

  const dialog = document.getElementById("dialog");
  const dialogBody = document.getElementById("dialogBody");
  const modal = document.getElementById("newsletterModal");
  const modalContent = document.getElementById("newsletterModalContent");

  function closeDialog() {
    dialog.classList.add("closing", "fade-out");
    setTimeout(() => {
      dialog.classList.add("hidden");
      dialog.classList.remove("closing", "fade-out");
    }, 300);
  }

  function showModal(status, message) {
    if (status === "loading") {
      modalContent.innerHTML = `
        <div class="spinner"></div>
        <p class="modal-status-text">Submitting participation...</p>
      `;
    } else if (status === "success") {
      modalContent.innerHTML = `
        <div class="success-icon">✓</div>
        <p class="modal-status-text success-text">${message}</p>
      `;
      setTimeout(() => {
        modal.style.display = "none";
      }, 2000);
    } else if (status === "error") {
      modalContent.innerHTML = `
        <div class="error-icon">X</div>
        <p class="modal-status-text error-text">${message}</p>
        <button onclick="closeNewsletterModal()">Close</button>
      `;
    }
    modal.style.display = "flex";
  }

  window.closeNewsletterModal = function () {
    modal.style.display = "none";
  };

  document.querySelectorAll(".dialog-close-btn").forEach((btn) => {
    btn.addEventListener("click", closeDialog);
  });

  window.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });

  // Fetch events
  fetch(`${BASE_URL}/api/events`)
    .then((res) => res.json())
    .then((data) => {
      const now = new Date();
      const events = (data.docs || []).filter(
        (event) => new Date(event.startTime) > now
      );

      if (events.length === 0) {
        container.innerHTML = `
          <div class="no-event-card">
            <div class="no-event-content">
              <h2>No Upcoming Events</h2>
              <p>Please check back later!</p>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = events
        .map((event, index) => {
          const start = new Date(event.startTime);
          const end = new Date(event.endTime);

          const formattedDate = start.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          const formattedTime = `${start.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })} - ${end.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;

          return `
            <div class="event-card">
              <div class="event-date">
                <h6>${formattedDate}</h6>
                <span>${formattedTime}</span>
              </div>
              <div class="event-info">
                <span class="event-label">Register Now!!</span>
                <h6 class="event-title">${event.title}</h6>
              </div>
              <div class="event-button-wrapper">
                <button 
                  class="btn btn-primary-filled btn-radius view-details-btn"
                  data-index="${index}"
                >
                  View Details
                </button>
              </div>
            </div>
          `;
        })
        .join("");

      document.querySelectorAll(".view-details-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.currentTarget.getAttribute("data-index");
          const event = events[index];
          if (!event) return;

          const start = new Date(event.startTime);
          const end = new Date(event.endTime);

          const formattedDate = start.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          const formattedTime = `${start.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })} - ${end.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;

          const description =
            event.description?.map((p) => `<p>${p}</p>`).join("") || "";

          const tags =
            event.tags
              ?.map(
                (tag) =>
                  `<p class="event-tag"><span class="tag-circle-red"></span>${tag}</p>`
              )
              .join("") || "";

          const location = event.location || "Not specified";

          // Build dialog content
          dialogBody.innerHTML = `
            <div class="event-dialog-header">
              <h5 class="event-dialog-title">${event.title}</h5>
              <div class="event-dialog-datetime">
                <h6 class="event-date">${formattedDate}</h6>
                <span class="event-time">${formattedTime}</span>
              </div>
            </div>

            <div class="event-dialog-body">
              <p class="event-des">${description}</p>
              <div class="event-tags">${tags}</div>
              <div class="event-location">
                <span class="venue-heading"><strong>Venue</strong></span>
                <p class="venue-address">${location}</p>
              </div>

              <div class="participant-form">
                <h4>Participate</h4>
                <input type="text" id="participantName" placeholder="Full Name" required />
                <input type="email" id="participantEmail" placeholder="Email" required />
                <input type="text" id="participantContact" placeholder="Contact Number" required />
              </div>
            </div>

            <div class="dialog-actions">
              <button class="btn btn-primary-filled dialog-close-btn">Cancel</button>
              <button class="btn btn-primary-filled participate-btn">Participate</button>
            </div>
          `;

          dialogBody
            .querySelectorAll(".dialog-close-btn")
            .forEach((btn) => btn.addEventListener("click", closeDialog));

          dialogBody
            .querySelector(".participate-btn")
            .addEventListener("click", async () => {
              const fullName = dialogBody
                .querySelector("#participantName")
                .value.trim();
              const email = dialogBody
                .querySelector("#participantEmail")
                .value.trim();
              const contact = dialogBody
                .querySelector("#participantContact")
                .value.trim();

              if (!fullName || !email || !contact) {
                showModal("error", "Please fill in all fields.");
                return;
              }

              showModal("loading");

              try {
                const response = await fetch(
                  `${BASE_URL}/api/participants/${event.eventId}/add`, // NOTE: using event.eventId instead of _id
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fullName, email, contact }),
                  }
                );

                const result = await response.json();
                if (!response.ok)
                  throw new Error(result.message || "Something went wrong");

                showModal("success", "Participation successful!");
                closeDialog();
              } catch (err) {
                console.error("Participation error:", err);
                showModal("error", "Failed to participate. Please try again.");
              }
            });

          dialog.classList.remove("hidden");
        });
      });
    })
    .catch((err) => {
      console.error("Failed to fetch events:", err);
      container.innerHTML = `<p class="text-center py-10">Unable to load events at this time.</p>`;
    });
});

// event.html recent event card
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_URL}/api/events`)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("recentEventsContainer");
      const wrapper = document.getElementById("recentEventsWrapper");

      if (!data || !Array.isArray(data.docs)) {
        if (wrapper) {
          wrapper.innerHTML = `
            <div class="no-event-card">
              <div class="no-event-content">
                <h2>No Recent Events</h2>
                <p>Events that have ended will appear here.</p>
              </div>
            </div>
          `;
        }
        return;
      }

      const now = new Date();
      const events = data.docs;

      const recentEvents = events.filter((event) => {
        return new Date(event.endTime) <= now;
      });

      if (recentEvents.length === 0) {
        if (wrapper) {
          wrapper.innerHTML = `
            <div class="no-event-card">
              <div class="no-event-content">
                <h2>No Recent Events</h2>
                <p>Events that have ended will appear here.</p>
              </div>
            </div>
          `;
        }
        return;
      }

      if (container) {
        container.innerHTML = recentEvents
          .map((event) => {
            const formattedDate = new Date(event.endTime).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            );

            const imageSrc = event.images?.[0]?.filename
              ? `${BASE_URL}/uploads/${event.images[0].filename}`
              : "assets/placeholder.jpg";

            return `
              <div class="recent-event-card" data-id="${event.eventId}">
                <div class="recent-event-image">
                  <img src="${imageSrc}" alt="Event image">
                </div>
                <div class="recent-event-title">
                  <h4>${event.title}</h4>
                </div>
                <div class="recent-event-date">
                  <p>${formattedDate} <span>-</span> ${formattedDate}</p>
                </div>
              </div>
            `;
          })
          .join("");
      }

      // Attach click events safely only if container exists
      if (container) {
        setTimeout(() => {
          document.querySelectorAll(".recent-event-card").forEach((card) => {
            card.addEventListener("click", () => {
              const eventId = card.dataset.id;
              localStorage.setItem("selectedEventId", eventId);
              window.location.href = "event-detail.html";
            });
          });
        }, 0);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch recent events", err);
      const container = document.getElementById("recentEventsContainer");
      const wrapper = document.getElementById("recentEventsWrapper");

      const target = container || wrapper;
      if (target) {
        target.innerHTML = `
          <div class="no-event-card">
            <div class="no-event-content">
              <h2>Error loading recent events</h2>
              <p>Please try again later.</p>
            </div>
          </div>
        `;
      }
    });
});

// event-detail page
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".event-detail");
  const eventId = localStorage.getItem("selectedEventId");

  if (!eventId) {
    container.innerHTML = `
      <h1>Event Not Found</h1>
      <p>No event ID found</p>
    `;
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}`);
    if (!res.ok) throw new Error("Event not found");

    const { event } = await res.json();
    if (!event) throw new Error("No event data");

    const title = event.title || "Untitled Event";
    const description = Array.isArray(event.description)
      ? event.description.map((p) => `<p>${p}</p>`).join("")
      : `<p>${event.description || "No description available."}</p>`;

    const images = (event.images || [])
      .slice(0, 3)
      .map((img, i) => {
        return `<div class="div${i + 1} img-holder">
                  <img src="${BASE_URL}/uploads/${
          img.filename
        }" alt="Event Image" />
                </div>`;
      })
      .join("");

    const startDate = new Date(event.startTime).toLocaleString();
    const endDate = new Date(event.endTime).toLocaleString();

    container.innerHTML = `
    <h1>${title}</h1>
    <div class="event-meta two-column">
      <div class="meta-left">
        <h6>Location</h6>
        <p>${event.location || "Not specified"}</p>
        <p><strong>Date:</strong> ${startDate} - ${endDate}</p>
      </div>
      <div class="meta-right">
        <p><strong>Tags:</strong> ${event.tags?.join(", ") || "None"}</p>
        <p><strong>Category:</strong> ${event.category || "None"}</p>
        <p><strong>Organizer:</strong> ${event.organizer || "Unknown"}</p>
      </div>
    </div>
    ${
      event.images?.length
        ? `<div class="img-container parent">${images}</div>`
        : ""
    }
    <div class="description">${description}</div>
  `;
  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `
      <h1>Failed to load event</h1>
      <p>There was a problem fetching the event details.</p>
    `;
  }
});
