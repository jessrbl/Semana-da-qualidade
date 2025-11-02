// Contadores para tentativas e erros
let totalTentativas = 0;
let totalErros = 0;

// Para mobile
let draggedElement = null;

// Drag PC
function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.target.classList.add("dragging");
}

// Drag end PC
function dragendHandler(ev) {
  ev.target.classList.remove("dragging");
}

// Touch start (mobile)
function touchStartHandler(ev) {
  draggedElement = ev.target;
  draggedElement.classList.add("dragging");
}

// Touch move (mobile)
function touchMoveHandler(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];
  draggedElement.style.position = "absolute";
  draggedElement.style.left = touch.clientX - draggedElement.offsetWidth / 2 + "px";
  draggedElement.style.top = touch.clientY - draggedElement.offsetHeight / 2 + "px";
  draggedElement.style.zIndex = 1000;
}

// Touch end (mobile)
function touchEndHandler(ev) {
  draggedElement.classList.remove("dragging");
  
  // Detecta card sob o dedo
  const touch = ev.changedTouches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const card = element.closest(".card");
  
  if (card) {
    const aceita = card.dataset.accept?.split(",").map(s => s.trim());
    const draggedId = draggedElement.id;
    
    totalTentativas++;
    
    if (!aceita || aceita.includes(draggedId)) {
      card.querySelector(".card-objects").appendChild(draggedElement);
      draggedElement.style.position = "";
      draggedElement.style.left = "";
      draggedElement.style.top = "";
      draggedElement.style.zIndex = "";
    } else {
      totalErros++;
      alert("Figura não corresponde a este card!");
      draggedElement.style.position = "";
      draggedElement.style.left = "";
      draggedElement.style.top = "";
      draggedElement.style.zIndex = "";
    }
    
    verificarFinal();
  } else {
    // Se não estiver sobre nenhum card, volta para a posição original
    draggedElement.style.position = "";
    draggedElement.style.left = "";
    draggedElement.style.top = "";
    draggedElement.style.zIndex = "";
  }
  draggedElement = null;
}

// Seleciona todas as figuras
const figures = document.querySelectorAll(".draggable");
figures.forEach(img => {
  // PC
  img.addEventListener("dragstart", dragstartHandler);
  img.addEventListener("dragend", dragendHandler);

  // Mobile
  img.addEventListener("touchstart", touchStartHandler, {passive: false});
  img.addEventListener("touchmove", touchMoveHandler, {passive: false});
  img.addEventListener("touchend", touchEndHandler);
});
