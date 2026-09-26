
const selectorField = document.getElementById("selectorField");
const list = document.getElementById("list");
const selectedText = document.getElementById("selectedText");
const items = document.querySelectorAll(".social-item");

selectorField.onclick = () => {
  list.classList.toggle("show");
};

items.forEach(item => {
  item.onclick = () => {
    selectedText.textContent = item.innerText;
    list.classList.remove("show");

    const color = item.getAttribute("data-color");

    document.body.style.background = `
      radial-gradient(circle at center,
      ${color}20 0%,   /* transparent tint */
      ${color}40 40%, 
      ${color}80 100%)
    `;
  };
});

