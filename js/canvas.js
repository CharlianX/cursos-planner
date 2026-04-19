const canvas = new fabric.Canvas('pizarra', {
    isDrawingMode: true,
    backgroundColor: '#ffffff'
});

function resizeCanvas() {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight - document.querySelector('.toolbar').offsetHeight);
    canvas.renderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.freeDrawingBrush.color = '#000000';
canvas.freeDrawingBrush.width = 5;

const btnPincel = document.getElementById('btnPincel');
const btnMover = document.getElementById('btnMover');
const btnRect = document.getElementById('btnRect');
const btnCirc = document.getElementById('btnCirc');
const btnImg = document.getElementById('btnImg');
const imageUpload = document.getElementById('imageUpload');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');
const clearBtn = document.getElementById('clear');

// --- HERRAMIENTAS PRINCIPALES ---
btnPincel.addEventListener('click', () => {
    canvas.isDrawingMode = true;
    btnPincel.classList.add('active');
    btnMover.classList.remove('active');
});

function activarModoMover() {
    canvas.isDrawingMode = false;
    btnMover.classList.add('active');
    btnPincel.classList.remove('active');
}

btnMover.addEventListener('click', activarModoMover);

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

// --- FIGURAS GEOMÉTRICAS ---
btnRect.addEventListener('click', () => {
    const rect = new fabric.Rect({
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 50,
        fill: colorPicker.value,
        width: 100,
        height: 100,
        rx: 10, // Bordes un poco redondeados
        ry: 10
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    activarModoMover();
});

btnCirc.addEventListener('click', () => {
    const circle = new fabric.Circle({
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 50,
        fill: colorPicker.value,
        radius: 50
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    activarModoMover();
});

// --- IMÁGENES (Subir desde botón) ---
btnImg.addEventListener('click', () => {
    imageUpload.click(); // Abre la galería del iPad / PC
});

imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function(img) {
            // Escalar la imagen si es muy grande
            if (img.width > canvas.width / 2) {
                img.scaleToWidth(canvas.width / 2);
            }
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            activarModoMover();
        });
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

// --- IMÁGENES (Pegar desde portapapeles) ---
window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function() {
                    const image = new fabric.Image(imgObj);
                    if (image.width > canvas.width / 2) {
                        image.scaleToWidth(canvas.width / 2);
                    }
                    canvas.add(image);
                    canvas.centerObject(image);
                    canvas.setActiveObject(image);
                    activarModoMover();
                }
            };
            reader.readAsDataURL(blob);
        }
    }
});

// --- ZOOM Y PANEO ---
canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.995 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

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

// --- ZOOM Y PANEO PARA PANTALLAS TÁCTILES (iPad / Móviles) ---
let touchStartDist = 0;
let initialZoom = 1;
let isPinching = false;
let lastTouchX = 0;
let lastTouchY = 0;

// Escuchar cuando tocas la pantalla
canvas.upperCanvasEl.addEventListener('touchstart', function(e) {
    // Si hay exactamente 2 dedos en la pantalla...
    if (e.touches.length === 2) {
        isPinching = true;
        canvas.isDrawingMode = false; // Pausa temporalmente el dibujo para no manchar
        
        // Calcular la distancia inicial entre los dos dedos
        let dx = e.touches[0].pageX - e.touches[1].pageX;
        let dy = e.touches[0].pageY - e.touches[1].pageY;
        touchStartDist = Math.hypot(dx, dy);
        initialZoom = canvas.getZoom();
        
        // Guardar el punto medio entre los dos dedos para el paneo (movimiento)
        lastTouchX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
        lastTouchY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
    }
}, { passive: false });

// Escuchar mientras mueves los dedos
canvas.upperCanvasEl.addEventListener('touchmove', function(e) {
    if (isPinching && e.touches.length === 2) {
        e.preventDefault(); // Evita que Safari intente hacer zoom a toda la página web
        
        // 1. ZOOM (Pellizcar)
        let dx = e.touches[0].pageX - e.touches[1].pageX;
        let dy = e.touches[0].pageY - e.touches[1].pageY;
        let touchCurrentDist = Math.hypot(dx, dy);
        
        let zoom = initialZoom * (touchCurrentDist / touchStartDist);
        if (zoom > 20) zoom = 20; // Límite máximo
        if (zoom < 0.1) zoom = 0.1; // Límite mínimo
        
        let centerX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
        let centerY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
        
        canvas.zoomToPoint({ x: centerX, y: centerY }, zoom);
        
        // 2. PANEO (Mover la cámara con los dos dedos)
        let vpt = canvas.viewportTransform;
        vpt[4] += centerX - lastTouchX;
        vpt[5] += centerY - lastTouchY;
        canvas.requestRenderAll();
        
        // Actualizar coordenadas
        lastTouchX = centerX;
        lastTouchY = centerY;
    }
}, { passive: false });

// Escuchar cuando levantas los dedos
canvas.upperCanvasEl.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
        isPinching = false;
        canvas.setViewportTransform(canvas.viewportTransform);
        
        // Restaurar el modo dibujo solo si el botón de Pincel está activo
        if (document.getElementById('btnPincel').classList.contains('active')) {
            canvas.isDrawingMode = true;
        }
    }
});