
  const popup = document.getElementById("popup");

  function openPopup() {
    popup.classList.remove("no-transition");
    popup.classList.add("open-popup");
    popup.classList.remove("close-popup");
  }

  function closePopup() {
    // 1️⃣ Let it finish the 'close-popup' transform instantly
    popup.classList.add("close-popup");
    popup.classList.remove("open-popup");

    // 2️⃣ Wait a tiny bit before disabling transition
    //    (prevents showing a scaling glitch at top)
    setTimeout(() => {
      popup.classList.add("no-transition");
    }, 50); // 50ms is enough to settle transform state
  }
