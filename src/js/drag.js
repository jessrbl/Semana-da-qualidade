let totalTentativas = 0;
let totalErros = 0;
let draggedElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// Touch start
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");

  const touch = ev.touches[0];
  const rect = draggedElement.getBoundingClientRect();

  // offset do toque dentro da figura
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  // salva container original
  draggedElement.dataset.initialParent = draggedElement.parentNode.className;

  // move para body
  document.body.appendChild(draggedElement);
}

// Touch move
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];

  draggedElement.style.left = (touch.clientX - touchOffsetX) + "px";
  draggedElement.style.top = (touch.clientY - touchOffsetY) + "px";
}

// Touch end
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
    // fora do card, volta para original
    document.querySelector(`.${draggedElement.dataset.initialParent} .objects`).appendChild(draggedElement);
  }

  // reseta estilo
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";
  draggedElement = null;

  verificarFinal();
}

// Verificar final
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

// Mostrar resultado
function mostrarResultadoNoObjects(percentual) {
  const objectsContainer = document.querySelector(".objects");
  objectsContainer.innerHTML = ""; // limpa figuras

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

// Eventos touch
document.querySelectorAll(".draggable").forEach(img => {
  img.addEventListener("touchstart", touchStartHandler, { passive: false });
  img.addEventListener("touchmove", touchMoveHandler, { passive: false });
  img.addEventListener("touchend", touchEndHandler);
});
