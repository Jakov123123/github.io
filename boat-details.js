document.addEventListener("DOMContentLoaded", () => {
  // 1. Read the boat ID from the URL, e.g., boat-details.html?id=0001
  const urlParams = new URLSearchParams(window.location.search);
  const boatId = urlParams.get("id"); // e.g. "0001"

  // 2. Find the matching boat in boatsData
  const boat = boatsData.find((b) => b.id === boatId);
  if (!boat) {
    document.getElementById("boat-info").innerHTML = `
      <div class="boat-not-found">
        <h2>Boat Not Found</h2>
        <p>Sorry, we couldn't find the boat you're looking for.</p>
        <a href="boats.html" class="boat-button">Back to Boats</a>
      </div>
    `;
    return;
  }

  // Set page title
  document.title = `${boat.name} - Boatify`;

  // 3. Handle main image + thumbnails
  const mainImageEl = document.getElementById("mainImage");
  const thumbnailsContainer = document.getElementById("thumbnails");
  
  // Variable for the last image (can be easily changed)
  const lastBoatImage = boat.image || "default-boat.jpg";
  
  // Create fixed array of images with 0009.jpg as the first, followed by 0007.jpg and 0008.jpg
  // The last image will be the boat's own image or the default
  const boatImages = ["0009.jpg", "0007.jpg", "0008.jpg", lastBoatImage];
  
  // Display the main image (first in the array)
  mainImageEl.src = `boatImage/${boatImages[0]}`;
  thumbnailsContainer.innerHTML = "";
  
  // Create and display thumbnails
  boatImages.forEach((imgSrc, index) => {
    const thumb = document.createElement("img");
    thumb.src = `boatImage/${imgSrc}`;
    thumb.alt = `${boat.name} - Image ${index + 1}`;
    thumb.classList.add("thumbnail-image");
    
    // Make the first thumbnail appear selected
    if (index === 0) {
      thumb.style.borderColor = "#004aad";
      thumb.style.opacity = "1";
    } else {
      thumb.style.opacity = "0.7";
    }
    
    // Clicking a thumbnail updates the main image
    thumb.addEventListener("click", () => {
      mainImageEl.src = `boatImage/${imgSrc}`;
      
      // Reset all thumbnails and highlight the selected one
      document.querySelectorAll(".thumbnail-image").forEach(img => {
        img.style.borderColor = "transparent";
        img.style.opacity = "0.7";
      });
      
      thumb.style.borderColor = "#004aad";
      thumb.style.opacity = "1";
    });
    
    thumbnailsContainer.appendChild(thumb);
  });

  // 4. Build up the sections
  const boatInfoBasic = document.getElementById("boat-info-basic");
  const boatInfoExtended = document.getElementById("boat-info-extended");
  
  const captainBadge =
    boat.captain === "y"
      ? '<span class="captain-badge">With Captain</span>'
      : "";

  // Add ratings if available or default
  const rating = boat.rating || 4.5;
  const reviewCount = boat.reviewCount || Math.floor(Math.random() * 50) + 5;
  
  // Generate star rating HTML
  const starRating = generateStarRating(rating);
  
  // Prepare features list
  const featuresHtml = generateFeaturesList(boat);
  
  // Prepare amenities if available
  const amenitiesHtml = generateAmenitiesSection(boat);

  // Add About section under the photo
  document.querySelector('.boat-images-section').innerHTML += `
    <div class="about-under-photo">
      <h3 class="section-title">About This Boat</h3>
      <p class="boat-description">${boat.description || 'Experience the ultimate sailing adventure with this exceptional vessel. Perfect for both beginners and experienced sailors alike.'}</p>
    </div>
  `;

  // Basic info (right section) - with features
  boatInfoBasic.innerHTML = `
    <div class="boat-details-card">
      <h2 class="boat-name">
        ${boat.name} ${captainBadge}
      </h2>
      <div class="boat-model">${boat.model}</div>
      
      <div class="boat-rating">
        ${starRating}
        <span class="review-count">(${reviewCount} reviews)</span>
      </div>

      <!-- Icon-based specs grid -->
      <div class="boat-specs">
        <div class="boat-spec">
          <!-- Person icon for capacity -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                     1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                     1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          ${boat.capacity} people
        </div>
        <div class="boat-spec">
          <!-- Location pin icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 
                     5 9c0 5.25 7 13 7 13s7-7.75 
                     7-13c0-3.87-3.13-7-7-7zm0 
                     9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 
                     2.5-2.5 2.5 1.12 2.5 2.5-1.12 
                     2.5-2.5 2.5z"/>
          </svg>
          ${boat.location}
        </div>
        <div class="boat-spec">
          <!-- Calendar icon for year -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 
                     0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 
                     0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 
                     7h6v2h-6V7zm0 4h6v2h-6v-2zm0 
                     4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 
                     4h2v2H7v-2z"/>
          </svg>
          ${boat.year}
        </div>
        <div class="boat-spec">
          <!-- Ruler icon for length -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 
                     12 17 15.57 8.43 7 12 3.43 10.57 
                     2 9.14 3.43 7.71 2 5.57 4.14 4.14 
                     2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 
                     1.43L2 10.57 3.43 12 7 8.43 15.57 
                     17 12 20.57 13.43 22l1.43-1.43L16.29 
                     22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 
                     16.29z"/>
          </svg>
          ${boat.length}m
        </div>
      </div>

      <!-- Features list in right side box -->
      <h3 class="section-title">Features</h3>
      ${featuresHtml}

      <!-- Price -->
      <div class="boat-price">€${boat.pricePerDay} per day</div>
      
      <!-- Booking section directly in the main info card -->
      <div class="booking-section">
        <div class="date-selection">
          <label for="booking-dates">Select Dates:</label>
          <input type="text" id="booking-dates" class="date-input" placeholder="Choose your sailing dates">
        </div>
        <button class="boat-button">Book Now</button>
      </div>
    </div>
  `;
  
  // Extended info (bottom section) - Only showing amenities if available, removing About This Boat
  if (boat.amenities && boat.amenities.length > 0) {
    boatInfoExtended.innerHTML = `
      <div class="boat-details-extended-content">
        <!-- Amenities section if available -->
        ${amenitiesHtml}
      </div>
    `;
  } else {
    // Hide the extended section completely if no amenities
    boatInfoExtended.style.display = 'none';
  }

  // Initialize date picker for booking
  initDatePicker();
});

// Helper function to generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += `<svg class="star-icon filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  
  // Half star if needed
  if (halfStar) {
    starsHtml += `<svg class="star-icon half-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += `<svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  
  return `<div class="star-rating">${starsHtml}</div>`;
}

// Helper function to generate features list
function generateFeaturesList(boat) {
  // Default features if not specified in the boat object
  const features = boat.features || [
    "Comfortable cabin space",
    "Modern navigation equipment",
    "Safety gear for all passengers",
    "Swim ladder",
    "Sun deck area"
  ];
  
  let featuresHtml = `<div class="boat-features">`;
  
  features.forEach(feature => {
    featuresHtml += `
      <div class="feature-item">
        <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        ${feature}
      </div>
    `;
  });
  
  featuresHtml += `</div>`;
  return featuresHtml;
}

// Helper function to generate amenities section
function generateAmenitiesSection(boat) {
  if (!boat.amenities) return '';
  
  let amenitiesHtml = `
    <div class="amenities-section">
      <h3 class="section-title">Amenities</h3>
      <div class="amenities-grid">
  `;
  
  boat.amenities.forEach(amenity => {
    amenitiesHtml += `
      <div class="amenity-item">
        <svg class="amenity-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        ${amenity}
      </div>
    `;
  });
  
  amenitiesHtml += `
      </div>
    </div>
  `;
  
  return amenitiesHtml;
}

// Initialize date picker
function initDatePicker() {
  if (!$) return; // Check if jQuery is available
  
  $('#booking-dates').daterangepicker({
    opens: 'center',
    autoApply: true,
    minDate: moment().add(1, 'days'),
    locale: {
      format: 'MMM D, YYYY'
    }
  });
}

// Add some CSS directly (will be added to boat-details.css later)
const style = document.createElement('style');
style.textContent = `
  .boat-rating {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .star-rating {
    display: flex;
    margin-right: 10px;
  }
  
  .star-icon {
    width: 20px;
    height: 20px;
    fill: #e0e0e0;
    margin-right: 2px;
  }
  
  .star-icon.filled {
    fill: #ffc107;
  }
  
  .star-icon.half-filled {
    fill: url(#half-filled-gradient);
  }
  
  .review-count {
    color: #757575;
    font-size: 14px;
  }
  
  .boat-features {
    margin: 20px 0;
  }
  
  .feature-item, .amenity-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    color: #37474f;
  }
  
  .feature-icon, .amenity-icon {
    width: 16px;
    height: 16px;
    fill: #004aad;
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .amenities-section {
    margin: 20px 0;
  }
  
  .section-title {
    font-size: 18px;
    color: #004aad;
    margin-bottom: 12px;
  }
  
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .booking-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .date-selection {
    margin-bottom: 15px;
  }
  
  .date-selection label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #37474f;
  }
  
  .date-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .boat-button {
    width: 100%;
    text-align: center;
  }
`;
document.head.appendChild(style);