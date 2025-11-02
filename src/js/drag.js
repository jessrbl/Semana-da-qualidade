// ==============================
// DRAG & DROP - MOBILE
// ==============================

let totalTentativas = 0;
let totalErros = 0;
let draggedElement = null;
let originalParent = null; // salvando o pai real

// Touch Start
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
  originalParent = draggedElement.parentNode; // salva pai real
}

// Touch Move
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];

  draggedElement.style.position = "absolute";
  draggedElement.style.left = touch.clientX - draggedElement.offsetWidth * 0.3 + "px";
  draggedElement.style.top = touch.clientY - draggedElement.offsetHeight * 0.3 + "px";
  draggedElement.style.zIndex = 1000;
}

// Touch End
function touchEndHandler(ev) {
  const touch = ev.changedTouches[0];
  draggedElement.classList.remove("dragging");

  let cardEncontrado = null;

  document.querySelectorAll(".card").forEach(card => {
    const rect = card.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      cardEncontrado = card;
    }
  });

  const draggedId = draggedElement.id;
  totalTentativas++;

  if (cardEncontrado) {
    const aceita = cardEncontrado.dataset.accept?.split(",").map(s => s.trim());
    if (aceita && aceita.includes(draggedId)) {
      cardEncontrado.querySelector(".card-objects").appendChild(draggedElement);
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
      originalParent.appendChild(draggedElement); // volta ao pai original
    }
  } else {
    // soltou fora de qualquer card
    originalParent.appendChild(draggedElement);
  }

  // Reseta estilo
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";
  draggedElement = null;

  verificarFinal();
}

// Verifica fim do jogo
function verificarFinal() {
  const allCards = document.querySelectorAll(".card");
  const totalFiguras = document.querySelectorAll(".draggable").length;
  let colocadas = 0;

  allCards.forEach(card => {
    colocadas += card.querySelectorAll(".card-objects .draggable").length;
  });

  if (colocadas === totalFiguras) {
    setTimeout(() => {
      alert(`Jogo concluído!\nTentativas: ${totalTentativas}\nErros: ${totalErros}`);
    }, 300);
  }
}

// Eventos Touch
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});
