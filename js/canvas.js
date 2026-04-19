const canvas = document.getElementById('pizarra');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');

let dibujando = false;

// Configuración inicial del pincel
ctx.lineCap = 'round';

// Función para empezar a dibujar
function startDrawing(e) {
    dibujando = true;
    draw(e);
}

// Función para dejar de dibujar
function stopDrawing() {
    dibujando = false;
    ctx.beginPath();
}

// Función principal de dibujo
function draw(e) {
    if (!dibujando) return;

    ctx.lineWidth = lineWidthInput.value;
    ctx.strokeStyle = colorPicker.value;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Futura integración con sync.js
    // if (typeof broadcastStroke === 'function') {
    //     broadcastStroke(x, y, colorPicker.value, lineWidthInput.value);
    // }
}

// Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Limpiar lienzo
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});