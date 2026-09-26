
    // Generate grid squares dynamically
    const grid = document.querySelector('.grid-background');
    const totalSquares = 200;
    for (let i = 0; i < totalSquares; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
    }

    const boxes = document.querySelectorAll('.grid-background div');

    function randomBlink() {
      // Randomly select 12 boxes
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        const box = boxes[randomIndex];
        box.classList.add('blink');
        // Remove blink class after animation
        setTimeout(() => box.classList.remove('blink'), 1500);
      }
    }

    // Blink 12 boxes every 500ms
    setInterval(randomBlink, 500);
