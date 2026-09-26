const scrollContainer = document.querySelector(".gallery");
const backBtn = document.getElementById("LeftBtn");
const nextBtn = document.getElementById("RightBtn");

// Enable native smooth scroll
scrollContainer.style.scrollBehavior = "smooth";

// Mouse wheel horizontal scroll
scrollContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollContainer.scrollBy({
    left: evt.deltaY,
    behavior: "smooth"
  });
});

// Right button scroll
nextBtn.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: 940,
    behavior: "smooth"
  });
});

// Left button scroll
backBtn.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: -940,
    behavior: "smooth"
  });
});
