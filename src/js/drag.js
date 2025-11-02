// ==============================
// DRAG & DROP - MOBILE
// ==============================

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

  // salva o pai original
  originalParent = draggedElement.parentNode;

  const touch = ev.touches[0];
  const rect = draggedElement.getBoundingClientRect();

  // calcula o offset do ponto de toque dentro da figura
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  // garante posição absoluta inicial
  draggedElement.style.position = "absolute";
  draggedElement.style.zIndex = 1000;
}

// ----------------------
// Touch Move
// ----------------------
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];

  // posiciona a figura alinhada com o dedo
  draggedElement.style.left = touch.clientX - touchOffsetX + "px";
  draggedElement.style.top = touch.clientY - touchOffsetY + "px";
}

// ----------------------
// Touch End
// ----------------------
function touchEndHandler(ev) {
  const touch = ev.changedTouches[0];
  draggedElement.classList.remove("dragging");

  let cardEncontrado = null;

  // verifica se o ponto do toque está dentro de algum card
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
      originalParent.appendChild(draggedElement);
    }
  } else {
    // soltou fora de qualquer card
    originalParent.appendChild(draggedElement);
  }

  // reseta estilos
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
