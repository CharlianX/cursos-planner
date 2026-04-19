const canvas = document.getElementById('pizarra');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const btnPincel = document.getElementById('btnPincel');
const btnBorrador = document.getElementById('btnBorrador');

let dibujando = false;
let isEraser = false; // Variable para saber si estamos borrando
let xAnterior = 0;
let yAnterior = 0;

// Ajustar el lienzo al tamaño de la pantalla
function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    // Le restamos el alto de la barra de herramientas
    canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas(); // Ejecutar al cargar

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Botones de herramientas
btnPincel.addEventListener('click', () => {
    isEraser = false;
    btnPincel.classList.add('active');
    btnBorrador.classList.remove('active');
});

btnBorrador.addEventListener('click', () => {
    isEraser = true;
    btnBorrador.classList.add('active');
    btnPincel.classList.remove('active');
});

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

    // 1. Dibujar localmente
    drawLine(xAnterior, yAnterior, xActual, yActual, color, grosor, isEraser);

    // 2. Enviar a Firebase (ahora incluye si es borrador o no)
    if (typeof window.broadcastStroke === 'function') {
        window.broadcastStroke(xAnterior, yAnterior, xActual, yActual, color, grosor, isEraser);
    }

    xAnterior = xActual;
    yAnterior = yActual;
}

// Función maestra: Dibuja y decide si raspa la pintura (borrador) o aplica color (pincel)
function drawLine(x0, y0, x1, y1, color, width, eraserMode) {
    ctx.beginPath();
    
    if (eraserMode) {
        ctx.globalCompositeOperation = 'destination-out'; // Actúa como borrador
    } else {
        ctx.globalCompositeOperation = 'source-over'; // Actúa como pincel normal
        ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
    
    // Restaurar a pincel por defecto para no arruinar otros trazos
    ctx.globalCompositeOperation = 'source-over';
}

window.drawExternally = drawLine;

// Magia Apple Pencil y Táctil: pointerdown en vez de mousedown
canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);
canvas.addEventListener('pointerout', stopDrawing);

// Limpiar lienzo
window.clearLocalCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

clearBtn.addEventListener('click', () => {
    if (typeof window.clearGlobalCanvas === 'function') {
        window.clearGlobalCanvas();
    } else {
        window.clearLocalCanvas();
    }
});