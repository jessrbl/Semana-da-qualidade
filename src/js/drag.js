let totalTentativas = 0;
let totalErros = 0;
let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// --- TOUCH START ---
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");

  const touch = ev.touches[0];
  const rect = draggedElement.getBoundingClientRect();

  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  // salvar container original
  draggedElement.dataset.initialParent = draggedElement.parentNode.className;

  // move para body
  document.body.appendChild(draggedElement);

  // garante posição absoluta inicial
  draggedElement.style.position = "absolute";
  draggedElement.style.left = (touch.clientX - touchOffsetX) + "px";
  draggedElement.style.top = (touch.clientY - touchOffsetY) + "px";
  draggedElement.style.zIndex = 1000;
  draggedElement.style.pointerEvents = "none";
}

// --- TOUCH MOVE ---
function touchMoveHandler(ev) {
  ev.preventDefault();
  if (!draggedElement) return;
  const touch = ev.touches[0];
  draggedElement.style.left = (touch.clientX - touchOffsetX) + "px";
  draggedElement.style.top = (touch.clientY - touchOffsetY) + "px";
}

// --- TOUCH END ---
function touchEndHandler(ev) {
  const touch = ev.changedTouches[0];
  if (!draggedElement) return;
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

  totalTentativas++;

  if (cardEncontrado) {
    const aceita = cardEncontrado.dataset.accept?.split(",").map(s => s.trim());
    if (aceita && aceita.includes(draggedElement.id)) {
      cardEncontrado.querySelector(".card-objects").appendChild(draggedElement);
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
      document.querySelector(`.${draggedElement.dataset.initialParent} .objects`).appendChild(draggedElement);
    }
  } else {
    document.querySelector(`.${draggedElement.dataset.initialParent} .objects`).appendChild(draggedElement);
  }

  // reset estilo
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";
  draggedElement.style.pointerEvents = "";
  draggedElement = null;

  verificarFinal();
}

// --- FINAL ---
function verificarFinal() {
  const allCards = document.querySelectorAll(".card");
  const totalFiguras = document.querySelectorAll(".draggable").length;
  let colocadas = 0;

  allCards.forEach(card => {
    colocadas += card.querySelectorAll(".card-objects .draggable").length;
  });

  if (colocadas === totalFiguras) {
    setTimeout(() => {
      mostrarResultadoNoObjects(Math.round((totalTentativas - totalErros)/totalTentativas*100));
    }, 300);
  }
}

// --- MOSTRAR RESULTADO ---
function mostrarResultadoNoObjects(percentual) {
  const objectsContainer = document.querySelector(".objects");
  objectsContainer.innerHTML = "";

  const resultadoTexto = document.createElement("div");
  resultadoTexto.style.textAlign = "center";
  resultadoTexto.style.padding = "20px";
  resultadoTexto.style.borderRadius = "12px";
  resultadoTexto.style.background = "#f0f0f0";
  resultadoTexto.style.width = "100%";

  if (percentual >= 70) {
    resultadoTexto.innerHTML = `<h2>Parabéns! 🎉</h2><p>Você acertou ${percentual}% das tentativas.</p>`;
  } else {
    resultadoTexto.innerHTML = `<h2>Ops!</h2><p>Você acertou apenas ${percentual}% das tentativas.</p>
    <button id="restart-btn">Recomeçar</button>`;

    const btn = resultadoTexto.querySelector("#restart-btn");
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.style.marginTop = "15px";
    btn.addEventListener("mouseover", () => btn.style.backgroundColor = "#45a049");
    btn.addEventListener("mouseout", () => btn.style.backgroundColor = "#4CAF50");
    btn.addEventListener("click", () => location.reload());
  }

  objectsContainer.appendChild(resultadoTexto);
}

// --- EVENTOS ---
document.querySelectorAll(".draggable").forEach(img => {
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});
