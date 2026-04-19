// Inicializamos el lienzo avanzado con Fabric.js
const canvas = new fabric.Canvas('pizarra', {
    isDrawingMode: true,
    backgroundColor: '#ffffff'
});

// Ajustar tamaño a la pantalla
function resizeCanvas() {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight - document.querySelector('.toolbar').offsetHeight);
    canvas.renderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Configuración inicial del pincel
canvas.freeDrawingBrush.color = '#000000';
canvas.freeDrawingBrush.width = 5;

// --- CONTROLES DE LA INTERFAZ ---
const btnPincel = document.getElementById('btnPincel');
const btnMover = document.getElementById('btnMover');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const clearBtn = document.getElementById('clear');

btnPincel.addEventListener('click', () => {
    canvas.isDrawingMode = true; // Activa el dibujo libre
    btnPincel.classList.add('active');
    btnMover.classList.remove('active');
});

btnMover.addEventListener('click', () => {
    canvas.isDrawingMode = false; // Permite seleccionar y mover lo dibujado
    btnMover.classList.add('active');
    btnPincel.classList.remove('active');
});

colorPicker.addEventListener('input', (e) => {
    canvas.freeDrawingBrush.color = e.target.value;
});

lineWidthInput.addEventListener('input', (e) => {
    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
});

clearBtn.addEventListener('click', () => {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
});

// --- ZOOM Y PANEO (Movimiento de cámara) ---
// Zoom in/out con rueda del ratón o gesto de pellizcar
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20; // Zoom máximo
    if (zoom < 0.1) zoom = 0.1; // Zoom mínimo
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

// Paneo: Si mantienes la tecla 'Alt' presionada y arrastras, mueves el lienzo
canvas.on('mouse:down', function(opt) {
    var evt = opt.e;
    if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});

canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', function(opt) {
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
});