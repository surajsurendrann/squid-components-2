const reviews = [
  {
    id: 4,
    name: "Sophia Martinez",
    verified: true,
    date: "2 days ago",
    rating: 5,
    text: "Absolutely loved it! Perfect for a family outing, and the view is stunning at sunset. Absolutely loved it! Perfect for a family outing, and the view is stunning at sunset.",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 5,
    name: "Michael Chen",
    verified: true,
    date: "3 days ago",
    rating: 3.7,
    text: "Good experience overall but parking was difficult to find.",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 6,
    name: "Isabella Rossi",
    verified: true,
    date: "3 days ago",
    rating: 2.5,
    text: "The place was too crowded, couldn't enjoy as much as I hoped.",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 7,
    name: "Daniel Kim",
    verified: false,
    date: "4 days ago",
    rating: 4.5,
    text: "Loved the architecture, the science exhibits are engaging for kids.",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: 8,
    name: "Emily Johnson",
    verified: true,
    date: "5 days ago",
    rating: 3,
    text: "The view is nice but the cafe prices are too high.",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
];

const minCardWidth = 250;
let currentIndex = 0;
let itemsToShow = 1;
let isDragging = false;
let startX = 0;

// --- Stars ---
function createStar(fill = 0) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");

  const bg = document.createElementNS(svgNS, "path");
  bg.setAttribute(
    "d",
    "M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.401 8.168L12 18.896l-7.335 3.864 1.401-8.168L.132 9.21l8.2-1.192z"
  );
  bg.setAttribute("fill", "#d2d2d2ff");

  const fg = document.createElementNS(svgNS, "path");
  fg.setAttribute(
    "d",
    "M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.401 8.168L12 18.896l-7.335 3.864 1.401-8.168L.132 9.21l8.2-1.192z"
  );
  fg.setAttribute("fill", "#fbbc05");
  fg.style.clipPath = `inset(0 ${100 - fill * 100}% 0 0)`;

  svg.appendChild(bg);
  svg.appendChild(fg);
  return svg;
}

function createStarRating(value) {
  const container = document.createElement("div");
  container.className = "sq-googleReviews__stars";
  for (let i = 1; i <= 5; i++) {
    let fill = 0;
    if (value >= i) fill = 1;
    else if (value > i - 1) fill = value - (i - 1);
    container.appendChild(createStar(fill));
  }
  return container;
}

// --- Modal ---
function showModal(review) {
  const overlay = document.createElement("div");
  overlay.className = "sq-googleReview_reviewModal-overlay";

  const modal = document.createElement("div");
  modal.className = "sq-googleReview_reviewModal";

  // Close
  const closeBtn = document.createElement("button");
  closeBtn.className = "sq-googleReview_reviewModal-close";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => document.body.removeChild(overlay));

  // Header
  const header = document.createElement("div");
  header.className = "sq-googleReview_reviewModal-header";
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "sq-googleReview_reviewModal-avatar";
  if (review.avatar) {
    const img = document.createElement("img");
    img.src = review.avatar;
    img.alt = review.name;
    avatarDiv.appendChild(img);
  } else avatarDiv.textContent = review.name[0];

  const info = document.createElement("div");
  info.className = "sq-googleReview_reviewModal-info";

  const nameRow = document.createElement("div");
  nameRow.className = "sq-googleReview_reviewModal-nameRow";
  const nameEl = document.createElement("span");
  nameEl.className = "sq-googleReview_reviewModal-name";
  nameEl.textContent = review.name;
  nameRow.appendChild(nameEl);
  if (review.verified) {
    const verifiedWrapper = document.createElement("span");
    verifiedWrapper.className = "sq-googleReview_reviewModal-verifiedWrapper";
    const verifiedIcon = document.createElement("img");
    verifiedIcon.src = "/verified.svg";
    verifiedIcon.alt = "verified";
    verifiedIcon.className = "sq-googleReview_reviewModal-verified";
    verifiedWrapper.appendChild(verifiedIcon);
    nameRow.appendChild(verifiedWrapper);
  }

  const dateEl = document.createElement("div");
  dateEl.className = "sq-googleReview_reviewModal-date";
  dateEl.textContent = review.date;

  info.appendChild(nameRow);
  info.appendChild(dateEl);

  header.appendChild(avatarDiv);
  header.appendChild(info);

  const stars = createStarRating(review.rating);
  stars.className = "sq-googleReview_reviewModal-stars";

  const textDiv = document.createElement("div");
  textDiv.className = "sq-googleReview_reviewModal-text";
  textDiv.textContent = review.text;

  modal.appendChild(closeBtn);
  modal.appendChild(header);
  modal.appendChild(stars);
  modal.appendChild(textDiv);
  overlay.appendChild(modal);

  overlay.addEventListener("click", () => document.body.removeChild(overlay));
  modal.addEventListener("click", (e) => e.stopPropagation());

  document.body.appendChild(overlay);
}

// --- Carousel ---
function renderCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const viewport = document.createElement("div");
  viewport.className = "sq-googleReviews-carousel__viewport";

  const track = document.createElement("div");
  track.className = "sq-googleReviews-carousel__track";
  track.style.display = "grid";
  track.style.gridTemplateColumns = `repeat(${reviews.length}, ${
    100 / itemsToShow
  }%)`;

  reviews.forEach((review) => {
    const card = document.createElement("div");
    card.className = "sq-googleReviews-carousel__card";

    // Review card content
    const reviewCard = document.createElement("div");
    reviewCard.className = "sq-googleReviews__reviewCard";

    // Header
    const header = document.createElement("div");
    header.className = "sq-googleReviews__reviewCard-headerSection";
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "sq-googleReviews__reviewCard-avatar";
    if (review.avatar) {
      const img = document.createElement("img");
      img.src = review.avatar;
      img.alt = review.name;
      avatarDiv.appendChild(img);
    } else avatarDiv.textContent = review.name[0];

    const infoDiv = document.createElement("div");
    infoDiv.textContent = review.name;

    header.appendChild(avatarDiv);
    header.appendChild(infoDiv);
    header.appendChild(createStarRating(review.rating));

    reviewCard.appendChild(header);

    // Content
    const textDiv = document.createElement("div");
    textDiv.className = "sq-googleReviews__reviewCard-contentSection";
    textDiv.textContent = review.text;

    const readMore = document.createElement("a");
    readMore.textContent = " Read more";
    readMore.href = "#";
    readMore.addEventListener("click", (e) => {
      e.preventDefault();
      showModal(review);
    });

    textDiv.appendChild(readMore);
    reviewCard.appendChild(textDiv);

    card.appendChild(reviewCard);
    track.appendChild(card);
  });

  viewport.appendChild(track);
  container.appendChild(viewport);

  // Buttons
  const btnPrev = document.createElement("button");
  btnPrev.textContent = "‹";
  btnPrev.className =
    "sq-googleReviews-carousel__button sq-googleReviews-carousel__button--left";
  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    updateCarousel(container, track);
  });

  const btnNext = document.createElement("button");
  btnNext.textContent = "›";
  btnNext.className =
    "sq-googleReviews-carousel__button sq-googleReviews-carousel__button--right";
  btnNext.addEventListener("click", () => {
    if (currentIndex < reviews.length - itemsToShow) currentIndex++;
    updateCarousel(container, track);
  });

  container.appendChild(btnPrev);
  container.appendChild(btnNext);

  // Swipe
  viewport.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });
  viewport.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
  });
  viewport.addEventListener("mouseup", (e) => {
    handleSwipe(e.clientX, track);
  });
  viewport.addEventListener("mouseleave", (e) => {
    handleSwipe(e.clientX, track);
  });

  viewport.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });
  viewport.addEventListener("touchend", (e) => {
    handleSwipe(e.changedTouches[0].clientX, track);
  });

  updateCarousel(container, track);
}

function handleSwipe(endX, track) {
  if (!isDragging) return;
  const diff = endX - startX;
  isDragging = false;
  if (Math.abs(diff) > 50) {
    if (diff < 0 && currentIndex < reviews.length - itemsToShow) currentIndex++;
    else if (diff > 0 && currentIndex > 0) currentIndex--;
    updateCarousel(null, track);
  }
}

function updateCarousel(container, track) {
  track.style.transform = `translateX(-${(100 / itemsToShow) * currentIndex}%)`;
}

// --- Init ---
window.addEventListener("DOMContentLoaded", () => {
  // Summary stars
  const summaryStars = document.getElementById("summary-stars");
  summaryStars.appendChild(createStarRating(4.7));

  // Calculate items to show
  const containerWidth = window.innerWidth;
  itemsToShow = Math.max(1, Math.floor(containerWidth / minCardWidth));

  renderCarousel("googleReviews");
  window.addEventListener("resize", () => {
    itemsToShow = Math.max(1, Math.floor(window.innerWidth / minCardWidth));
    renderCarousel("googleReviews");
  });
});
