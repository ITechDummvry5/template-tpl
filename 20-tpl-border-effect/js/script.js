
/* Each item below becomes one input with its description under it.
   Edit the text here to change a description.
   The markup for a single effect looks like this (example: effect 7):
     <div class="col-3">
       <input class="effect-7" type="text" placeholder="Placeholder Text">
       <span class="focus-border"><i></i></span>
     </div>
   Label effects (16-24) also use class "input-effect" on the wrapper and a <label> after the input. */
const EFFECTS = [
  // Border effects
  "Underline grows from left to right.",
  "Underline grows outward from the center.",
  "Underline grows from both edges to the center.",
  "Box border rises up from the bottom; text slides in.",
  "Box border sweeps in from the left; text slides in.",
  "Box border sweeps in from the right; text slides in.",
  "Box border draws out from the middle of each side.",
  "Box border draws from opposite corners at once.",
  "Box border traces around one side at a time.",
  // Background effects
  "Grey background fades in.",
  "Grey background fills from the left.",
  "Grey background fills outward from the center.",
  "Grey background fills from both sides to the middle.",
  "Grey background grows from two opposite corners.",
  "Grey background opens from the center in two halves.",
  // Label effects
  "Label floats up. Underline grows left to right.",
  "Label floats up. Underline grows from the center.",
  "Label floats up. Underline grows from both edges.",
  "Label floats up. Border draws from the middle.",
  "Label floats up. Border draws from opposite corners.",
  "Label floats up. Border traces one side at a time.",
  "Label floats up. Background fills from the left.",
  "Label floats up. Background grows from two corners.",
  "Label floats up. Background opens from the center."
];
const HEADINGS = { 1: "Border effects", 10: "Background Effects", 16: "Input with Label Effects" };

const demo = document.getElementById('demo');
demo.innerHTML = EFFECTS.map((desc, k) => {
  const n = k + 1;
  const hasLabel = n >= 16;
  const isBg = (n >= 10 && n <= 15) || n >= 22;
  const hasI = (n >= 7 && n <= 9) || (n >= 19 && n <= 21);
  return (HEADINGS[n] ? `<h2>${HEADINGS[n]}</h2>` : '') +
    `<div class="col-3${hasLabel ? ' input-effect' : ''}">` +
      `<input class="effect-${n}" type="text" placeholder="${hasLabel ? '' : 'Placeholder Text'}">` +
      (hasLabel ? '<label>First Name</label>' : '') +
      `<span class="${isBg ? 'focus-bg' : 'focus-border'}">${hasI ? '<i></i>' : ''}</span>` +
      `<small class="desc"><b>Effect ${n}</b>${desc}</small>` +
    `</div>`;
}).join('');

// Label effects: keep the label up when the field has text
document.querySelectorAll('.input-effect input').forEach(input => {
  input.value = '';
  const check = () => input.classList.toggle('has-content', input.value !== '');
  input.addEventListener('input', check);
  input.addEventListener('blur', check);
});
