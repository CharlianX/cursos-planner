const canvas = document.getElementById('pizarra');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');

let dibujando = false;
let xAnterior = 0;
let yAnterior = 0;

// Configuración inicial del pincel
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function startDrawing(e) {
    dibujando = true;
    const rect = canvas.getBoundingClientRect();
    xAnterior = e.clientX - rect.left;
    yAnterior = e.clientY - rect.top;
}

function stopDrawing() {
    dibujando = false;
    ctx.beginPath();
}

function draw(e) {
    if (!dibujando) return;

    const rect = canvas.getBoundingClientRect();
    const xActual = e.clientX - rect.left;
    const yActual = e.clientY - rect.top;
    const color = colorPicker.value;
    const grosor = lineWidthInput.value;

    // 1. Dibujar en tu pantalla
    drawLine(xAnterior, yAnterior, xActual, yActual, color, grosor);

    // 2. Enviar a Firebase (si la conexión está lista)
    if (typeof window.broadcastStroke === 'function') {
        window.broadcastStroke(xAnterior, yAnterior, xActual, yActual, color, grosor);
    }

    // Actualizar coordenadas
    xAnterior = xActual;
    yAnterior = yActual;
}

// Función maestra para dibujar líneas (la usas tú y tu amigo)
function drawLine(x0, y0, x1, y1, color, width) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}

// Exponemos la función para que Firebase pueda activarla desde sync.js
window.drawExternally = drawLine;

// Event Listeners del ratón
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Limpiar lienzo local
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});