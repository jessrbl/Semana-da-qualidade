let totalTentativas = 0;
let totalErros = 0;

let draggedElement = null;
let originalParent = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// ----------------------
// Touch Start
// ----------------------
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
  originalParent = draggedElement.parentNode;

  const touch = ev.touches[0];
  const rect = draggedElement.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  draggedElement.style.position = "absolute";
  draggedElement.style.zIndex = 1000;
}

// ----------------------
// Touch Move
// ----------------------
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];
  draggedElement.style.left = touch.clientX - touchOffsetX + "px";
  draggedElement.style.top = touch.clientY - touchOffsetY + "px";
}

// ----------------------
// Touch End
// ----------------------
function touchEndHandler(ev) {
  draggedElement.classList.remove("dragging");
  const touch = ev.changedTouches[0];

  // Detecta todos os elementos sob o ponto do toque
  const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
  let cardEncontrado = elementsAtPoint.find(el => el.classList.contains("card"));

  const draggedId = draggedElement.id;
  totalTentativas++;

  if (cardEncontrado) {
    const aceita = cardEncontrado.dataset.accept?.split(",").map(s => s.trim());
    if (aceita && aceita.includes(draggedId)) {
      cardEncontrado.querySelector(".card-objects").appendChild(draggedElement);
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
      originalParent.appendChild(draggedElement);
    }
  } else {
    // soltou fora de qualquer card
    originalParent.appendChild(draggedElement);
  }

  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";

  draggedElement = null;
  touchOffsetX = 0;
  touchOffsetY = 0;

  verificarFinal();
}

// ----------------------
// Verifica fim do jogo
// ----------------------
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

// ----------------------
// Eventos Touch
// ----------------------
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});
