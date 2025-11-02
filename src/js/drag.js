// ==============================
// DRAG & DROP - MOBILE
// ==============================

// Contadores
let totalTentativas = 0;
let totalErros = 0;
let draggedElement = null;
let placeholder = null;

// ----------------------
// Touch Start
// ----------------------
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");

  // cria placeholder para manter o espaço
  placeholder = document.createElement("div");
  placeholder.style.width = draggedElement.offsetWidth + "px";
  placeholder.style.height = draggedElement.offsetHeight + "px";
  placeholder.style.visibility = "hidden";
  draggedElement.parentNode.insertBefore(placeholder, draggedElement);

  // salva posição inicial
  draggedElement.dataset.initialParent = draggedElement.parentNode.className;
}

// ----------------------
// Touch Move
// ----------------------
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];

  draggedElement.style.position = "fixed"; // fixo na tela
  draggedElement.style.left = touch.clientX - draggedElement.offsetWidth / 2 + "px";
  draggedElement.style.top = touch.clientY - draggedElement.offsetHeight / 2 + "px";
  draggedElement.style.zIndex = 1000;
}

// ----------------------
// Touch End
// ----------------------
function touchEndHandler(ev) {
  const touch = ev.changedTouches[0];
  draggedElement.classList.remove("dragging");

  // Remove placeholder e mantém fluxo do layout
  if (placeholder) {
    placeholder.remove();
    placeholder = null;
  }

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
      // volta para container original
      const originalParent = document.querySelector(`.${draggedElement.dataset.initialParent} .objects`);
      if (originalParent) originalParent.appendChild(draggedElement);
    }
  } else {
    // fora de qualquer card, volta para container original
    const originalParent = document.querySelector(`.${draggedElement.dataset.initialParent} .objects`);
    if (originalParent) originalParent.appendChild(draggedElement);
  }

  // reseta estilos
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";

  draggedElement = null;

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
    // calcula percentual de acertos
    const percentual = Math.round(((totalTentativas - totalErros) / totalTentativas) * 100);
    mostrarResultadoNoObjects(percentual);
  }
}

// ----------------------
// Mostra resultado final no container .objects
// ----------------------
function mostrarResultadoNoObjects(percentual) {
  const objectsContainer = document.querySelector(".objects");
  objectsContainer.innerHTML = "";

  const resultadoTexto = document.createElement("div");
  resultadoTexto.className = "resultado-container"; // Adicione uma classe
  resultadoTexto.style.textAlign = "center";
  resultadoTexto.style.padding = "30px";
  resultadoTexto.style.borderRadius = "12px";
  resultadoTexto.style.background = "#f0f0f0";
  resultadoTexto.style.width = "100%";
  resultadoTexto.style.boxSizing = "border-box";

  if (percentual >= 70) {
    resultadoTexto.innerHTML = `
      <h2 style="font-size: 28px; margin: 0 0 15px 0; color: #2e7d32;">Parabéns! 🎉</h2>
      <p style="font-size: 22px; margin: 0; color: #333;">Você acertou ${percentual}% das tentativas.</p>
    `;
  } else {
    resultadoTexto.innerHTML = `
      <h2 style="font-size: 28px; margin: 0 0 15px 0; color: #c62828;">Ops! 😅</h2>
      <p style="font-size: 22px; margin: 0 0 20px 0; color: #333;">Você acertou apenas ${percentual}% das tentativas.</p>
      <button id="restart-btn">Recomeçar</button>
    `;

    const btn = resultadoTexto.querySelector("#restart-btn");
    btn.style.padding = "12px 25px";
    btn.style.fontSize = "20px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "15px";
    btn.style.fontWeight = "bold";

    btn.addEventListener("mouseover", () => btn.style.backgroundColor = "#45a049");
    btn.addEventListener("mouseout", () => btn.style.backgroundColor = "#4CAF50");
    btn.addEventListener("click", () => location.reload());
  }

  objectsContainer.appendChild(resultadoTexto);
  
  // Garantir que a right-column mantenha o alinhamento
  const rightColumn = document.querySelector('.right-column');
  rightColumn.style.display = 'flex';
  rightColumn.style.flexDirection = 'column';
  rightColumn.style.alignItems = 'center';
  rightColumn.style.justifyContent = 'center';
}

// ----------------------
// Adiciona eventos Touch
// ----------------------
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});
