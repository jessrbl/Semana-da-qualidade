// ==============================
// DRAG & DROP - PC + MOBILE
// ==============================

// Contadores para tentativas e erros
let totalTentativas = 0;
let totalErros = 0;

// Variável global para toque em mobile
let draggedElement = null;

// ----------------------
// Drag para PC
// ----------------------
function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.target.classList.add("dragging");
}

function dragendHandler(ev) {
  ev.target.classList.remove("dragging");
}

// ----------------------
// Touch para MOBILE
// ----------------------
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
}

function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];

  // Faz a imagem seguir o dedo, mantendo o ponto de toque como referência
  draggedElement.style.position = "absolute";
  draggedElement.style.left = touch.clientX - draggedElement.offsetWidth * 0.3 + "px";
  draggedElement.style.top = touch.clientY - draggedElement.offsetHeight * 0.3 + "px";
  draggedElement.style.zIndex = 1000;
  draggedElement.style.pointerEvents = "none"; // evita bloquear detecção do card
}

function touchEndHandler(ev) {
  const touch = ev.changedTouches[0];
  draggedElement.classList.remove("dragging");

  // Detecta o elemento sob o ponto de toque
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const card = element ? element.closest(".card") : null;

  if (card) {
    const aceita = card.dataset.accept?.split(",").map(s => s.trim());
    const draggedId = draggedElement.id;
    totalTentativas++;

    if (aceita && aceita.includes(draggedId)) {
      card.querySelector(".card-objects").appendChild(draggedElement);
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
    }
  }

  // Reseta posição
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";
  draggedElement.style.pointerEvents = "";
  draggedElement = null;

  verificarFinal();
}

// ----------------------
// Função para verificar fim do jogo
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
// Eventos
// ----------------------
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  // PC
  img.addEventListener("dragstart", dragstartHandler);
  img.addEventListener("dragend", dragendHandler);

  // MOBILE
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});

// ----------------------
// Eventos dos cards
// ----------------------
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.addEventListener("dragover", ev => ev.preventDefault());

  card.addEventListener("drop", ev => {
    ev.preventDefault();
    const draggedId = ev.dataTransfer.getData("text/plain");
    const draggedItem = document.getElementById(draggedId);
    const aceita = card.dataset.accept?.split(",").map(s => s.trim());

    totalTentativas++;

    if (aceita && aceita.includes(draggedId)) {
      card.querySelector(".card-objects").appendChild(draggedItem);
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
    }

    verificarFinal();
  });
});
