
    const circles = document.querySelectorAll(".circle");
    const numbers = document.querySelectorAll(".number");

    circles.forEach((circle, index) => {
        let target = numbers[index].getAttribute("data-target");
        let radius = circle.r.baseVal.value;
        let circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        let offset = circumference - (target / 100) * circumference;
        circle.style.animation = `progress${index} 2s forwards`;

        let counter = 0;
        let interval = setInterval(() => {
            if (counter >= target) {
                clearInterval(interval);
            } else {
                counter++;
                numbers[index].textContent = counter + "%";
            }
        }, 30);

        // Add unique animation
        const style = document.createElement("style");
        style.innerHTML = `
        @keyframes progress${index} {
            to { stroke-dashoffset: ${offset}; }
        }`;
        document.head.appendChild(style);
    });
