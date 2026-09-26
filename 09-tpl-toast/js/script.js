const successBtn = document.querySelector(".btn-success");
const errorBtn = document.querySelector(".btn-error");
const warningBtn = document.querySelector(".btn-warning");
const toastContainer = document.getElementById("toastContainer");

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconHTML = "";
  if (type === "success") iconHTML = `<i class="fa-solid fa-circle-check"></i>`;
  else if (type === "error") iconHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
  else if (type === "warning") iconHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

  toast.innerHTML = `
    ${iconHTML} 
    <span>${message}</span>
    <div class="progress"></div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3400);
}

successBtn.addEventListener("click", () => {
  showToast("Success! Operation completed successfully.", "success");
});
errorBtn.addEventListener("click", () => {
  showToast("Error! Something went wrong.", "error");
});
warningBtn.addEventListener("click", () => {
  showToast("Warning! Please check your input.", "warning");
});
