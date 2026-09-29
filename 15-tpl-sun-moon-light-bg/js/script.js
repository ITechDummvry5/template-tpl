
// Grid lines are generated here so the HTML stays short
const mk = (id, cls, n) => {
  const box = document.getElementById(id);
  for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = cls; box.appendChild(d); }
};
mk('retrobg-vlines', 'retrobg-vline', 51);
mk('retrobg-hlines', 'retrobg-hline', 8);

// Click the sun/moon to toggle "lights out"
document.querySelector("#retrobg-sun").onclick = () => {
  document.querySelector("#retrobg").classList.toggle("retrobg-shutdown");
};
