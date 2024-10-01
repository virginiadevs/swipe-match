const DECISION_THRESHOLD = 75;
let isAnimating = false;
let pullDeltaX = 0; // distancia que la carta se está arrastrando

function startDrag(event) {
    if(isAnimating) return;

    // primera imagen
    const actualCard = event.target.closest("article");
    if(!actualCard) return;

    // posición inicial del puntero
    const startX = event.pageX ?? event.touches[0].pageX;

    document.addEventListener("mouseover", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchover", onMove, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });

    function onMove(event) {
        // posición actual del puntero
        const currentX = event.pageX ?? event.touches[0].pageX;

        // distancia desde el punto inicial al actual
        pullDeltaX = currentX - startX;

        // no hay distancia recorrida
        if(pullDeltaX === 0) return;

        isAnimating = true;
        
        // calcular la inclinación de la carta en base a la distancia
        const deg = pullDeltaX / 14;

        // aplicar los cambios a la carta
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = "grabbing";

        // cambiar opacidad de la elección
        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;
        const choiceEl = isRight ? actualCard.querySelector(".choice.like") : actualCard.querySelector(".choice.nope");

        choiceEl.style.opacity = opacity;
    }

    function onEnd(event) {
        document.removeEventListener("mouseover", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchover", onMove, { passive: true });
        document.removeEventListener("touchend", onEnd, { passive: true });

        // saber si el usuario tomó una decision
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

        if(decisionMade) {
            const goRight = pullDeltaX >=0;
            const goLeft = !goRight;

            // añadir clase en base a la decisión
            actualCard.classList.add(goRight ? "go-right": "go-left");
        }
        else {
            actualCard.classList.add("reset");
            actualCard.classList.remove("go-right", "go-left");
            actualCard.querySelector(".choice").forEach(el => el.style.opacity = 0);
        }

        // resetear variables
        actualCard.addEventListener("transitionend", () => {
            actualCard.removeAttribute("style");
            actualCard.classList.remove("reset");
            pullDeltaX = 0;
            isAnimating = false;
        });
    }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });