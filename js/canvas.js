// Definimos el tamaño fijo de nuestra "Hoja"
const BASE_WIDTH = 2500;
const BASE_HEIGHT = 1500;
const wrapper = document.getElementById('canvas-wrapper');

const canvas = new fabric.Canvas('pizarra', {
    isDrawingMode: true,
    backgroundColor: '#ffffff',
    width: BASE_WIDTH,
    height: BASE_HEIGHT
});
canvas.freeDrawingBrush.color = '#000000';
canvas.freeDrawingBrush.width = 5;

// --- SISTEMA DE PÁGINAS ---
let paginas = [ null ]; // Array que guarda los lienzos en formato JSON
let paginaActual = 0;

const pageIndicator = document.getElementById('pageIndicator');

function guardarPaginaActual() {
    paginas[paginaActual] = JSON.stringify(canvas.toJSON());
}

function cargarPagina(index) {
    if (paginas[index]) {
        canvas.loadFromJSON(paginas[index], () => {
            canvas.renderAll();
        });
    } else {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
    }
    pageIndicator.textContent = `${index + 1} / ${paginas.length}`;
}

document.getElementById('btnNext').addEventListener('click', () => {
    if (paginaActual < paginas.length - 1) {
        guardarPaginaActual();
        paginaActual++;
        cargarPagina(paginaActual);
    }
});

document.getElementById('btnPrev').addEventListener('click', () => {
    if (paginaActual > 0) {
        guardarPaginaActual();
        paginaActual--;
        cargarPagina(paginaActual);
    }
});

document.getElementById('btnAddPage').addEventListener('click', () => {
    guardarPaginaActual();
    paginas.splice(paginaActual + 1, 0, null);
    paginaActual++;
    cargarPagina(paginaActual);
});

document.getElementById('btnDelPage').addEventListener('click', () => {
    if (paginas.length > 1) {
        paginas.splice(paginaActual, 1);
        if (paginaActual >= paginas.length) paginaActual = paginas.length - 1;
        cargarPagina(paginaActual);
    } else {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        paginas[0] = null;
    }
});

// --- HERRAMIENTAS (Pincel, Mover, Figuras) ---
const btnPincel = document.getElementById('btnPincel');
const btnMover = document.getElementById('btnMover');

function activarModoMover() {
    canvas.isDrawingMode = false;
    btnMover.classList.add('active');
    btnPincel.classList.remove('active');
}

btnPincel.addEventListener('click', () => {
    canvas.isDrawingMode = true;
    btnPincel.classList.add('active');
    btnMover.classList.remove('active');
});

btnMover.addEventListener('click', activarModoMover);

document.getElementById('colorPicker').addEventListener('input', (e) => canvas.freeDrawingBrush.color = e.target.value);
document.getElementById('lineWidth').addEventListener('input', (e) => canvas.freeDrawingBrush.width = parseInt(e.target.value, 10));
document.getElementById('clear').addEventListener('click', () => { canvas.clear(); canvas.backgroundColor = '#ffffff'; });

document.getElementById('btnRect').addEventListener('click', () => {
    const rect = new fabric.Rect({ left: 100, top: 100, fill: document.getElementById('colorPicker').value, width: 100, height: 100 });
    canvas.add(rect); activarModoMover();
});

document.getElementById('btnCirc').addEventListener('click', () => {
    const circ = new fabric.Circle({ left: 100, top: 100, fill: document.getElementById('colorPicker').value, radius: 50 });
    canvas.add(circ); activarModoMover();
});

document.getElementById('btnImg').addEventListener('click', () => document.getElementById('imageUpload').click());
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(f) {
        fabric.Image.fromURL(f.target.result, function(img) {
            if (img.width > 500) img.scaleToWidth(500);
            canvas.add(img); activarModoMover();
        });
    };
    if (file) reader.readAsDataURL(file);
});

// --- ZOOM Y SCROLL (Adaptado para las Barritas) ---
let currentZoom = 1;

canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    currentZoom *= 0.995 ** delta;
    if (currentZoom > 5) currentZoom = 5;
    if (currentZoom < 0.2) currentZoom = 0.2;
    
    canvas.setZoom(currentZoom);
    canvas.setDimensions({ width: BASE_WIDTH * currentZoom, height: BASE_HEIGHT * currentZoom });
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

// Mover con el ratón usando Alt + Click (ahora mueve el scroll, no la cámara virtual)
canvas.on('mouse:down', function(opt) {
    if (opt.e.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
    }
});

canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
        let e = opt.e;
        wrapper.scrollLeft -= (e.clientX - this.lastPosX);
        wrapper.scrollTop -= (e.clientY - this.lastPosY);
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', function() {
    this.isDragging = false;
    this.selection = true;
});

// --- GESTOS IPAD (Dos dedos) ---
let isPinching = false;
let initialZoom = 1;
let touchStartDist = 0;
let lastTouchX = 0;
let lastTouchY = 0;

canvas.upperCanvasEl.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
        isPinching = true;
        canvas.isDrawingMode = false;
        let dx = e.touches[0].pageX - e.touches[1].pageX;
        let dy = e.touches[0].pageY - e.touches[1].pageY;
        touchStartDist = Math.hypot(dx, dy);
        initialZoom = currentZoom;
        lastTouchX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
        lastTouchY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
    }
}, { passive: false });

canvas.upperCanvasEl.addEventListener('touchmove', function(e) {
    if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        
        // ZOOM
        let dx = e.touches[0].pageX - e.touches[1].pageX;
        let dy = e.touches[0].pageY - e.touches[1].pageY;
        currentZoom = initialZoom * (Math.hypot(dx, dy) / touchStartDist);
        if (currentZoom > 5) currentZoom = 5;
        if (currentZoom < 0.2) currentZoom = 0.2;
        
        canvas.setZoom(currentZoom);
        canvas.setDimensions({ width: BASE_WIDTH * currentZoom, height: BASE_HEIGHT * currentZoom });
        
        // SCROLL
        let centerX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
        let centerY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
        wrapper.scrollLeft -= (centerX - lastTouchX);
        wrapper.scrollTop -= (centerY - lastTouchY);
        
        lastTouchX = centerX;
        lastTouchY = centerY;
    }
}, { passive: false });

canvas.upperCanvasEl.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
        isPinching = false;
        if (document.getElementById('btnPincel').classList.contains('active')) {
            canvas.isDrawingMode = true;
        }
    }
});