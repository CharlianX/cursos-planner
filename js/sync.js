import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, set, push, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// !!! REEMPLAZA ESTO CON TUS DATOS DE FIREBASE !!!
const firebaseConfig = {

  apiKey: "AIzaSyCEnbavhYXz-WCI_2OyknC_Mpnp-_aM23c",

  authDomain: "tablon-charlianx.firebaseapp.com",

  databaseURL: "https://tablon-charlianx-default-rtdb.firebaseio.com",

  projectId: "tablon-charlianx",

  storageBucket: "tablon-charlianx.firebasestorage.app",

  messagingSenderId: "452711415042",

  appId: "1:452711415042:web:cfb4a1b37a8c4dede3561b"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencia global al canvas de Fabric (definido en canvas.js)
// Usamos un intervalo pequeño para esperar a que 'canvas' esté listo
const checkCanvas = setInterval(() => {
    if (window.canvas) {
        clearInterval(checkCanvas);
        initSync();
    }
}, 100);

function initSync() {
    const canvas = window.canvas;
    let isImporting = false; // Bandera para evitar bucles infinitos

    // Obtener la referencia a la página actual en la DB
    const getPageRef = () => ref(db, `pizarras/sala1/pagina_${window.paginaActual}`);

    // --- ENVIAR DATOS A FIREBASE ---
    
    // Cuando se añade algo (pincel, figura, imagen)
    canvas.on('object:added', (e) => {
        if (isImporting || e.target.id) return; 
        
        const obj = e.target;
        obj.id = Date.now() + Math.random().toString(36).substr(2, 9); // ID único
        
        const data = obj.toObject(['id']); // Incluimos el ID en el JSON
        set(ref(db, `pizarras/sala1/pagina_${window.paginaActual}/${obj.id}`), data);
    });

    // Cuando se mueve o escala algo
    canvas.on('object:modified', (e) => {
        if (isImporting) return;
        const obj = e.target;
        if (obj.id) {
            const data = obj.toObject(['id']);
            set(ref(db, `pizarras/sala1/pagina_${window.paginaActual}/${obj.id}`), data);
        }
    });

    // --- RECIBIR DATOS DE FIREBASE ---
    
    window.escucharCambios = () => {
        const currentRef = getPageRef();
        
        // Objeto nuevo creado por otro usuario
        onChildAdded(currentRef, (snapshot) => {
            const data = snapshot.val();
            const exists = canvas.getObjects().find(o => o.id === data.id);
            if (!exists) {
                isImporting = true;
                fabric.util.enlivenObjects([data], (objects) => {
                    objects.forEach(obj => {
                        canvas.add(obj);
                    });
                    isImporting = false;
                    canvas.renderAll();
                });
            }
        });

        // Objeto movido/cambiado por otro usuario
        onChildChanged(currentRef, (snapshot) => {
            const data = snapshot.val();
            const obj = canvas.getObjects().find(o => o.id === data.id);
            if (obj) {
                isImporting = true;
                obj.set(data);
                obj.setCoords(); // Importante para que los controles sigan al objeto
                canvas.renderAll();
                isImporting = false;
            }
        });
    };

    // Iniciar escucha inicial
    window.escucharCambios();
}