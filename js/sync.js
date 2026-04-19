import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, set, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const checkCanvas = setInterval(() => {
    if (window.canvas) {
        clearInterval(checkCanvas);
        initSync();
    }
}, 100);

function initSync() {
    const canvas = window.canvas;
    let isImporting = false; 

    // --- ENVIAR DATOS A FIREBASE ---
    canvas.on('object:added', (e) => {
        if (isImporting || e.target.id) return; 
        
        const obj = e.target;

        // ¡ESCUDO ANTI-MANCHAS NEGRAS PARA FIREBASE!
        if (obj.type === 'path') {
            obj.set({ fill: null });
        }
        
        obj.id = Date.now() + Math.random().toString(36).substr(2, 9); 
        const data = obj.toObject(['id']); 
        set(ref(db, `pizarras/sala1/pagina_${window.paginaActual}/${obj.id}`), data);
    });

    canvas.on('object:modified', (e) => {
        if (isImporting) return;
        const obj = e.target;
        if (obj.id) {
            // Re-aseguramos que no lleve relleno por si acaso
            if (obj.type === 'path') obj.set({ fill: null });
            const data = obj.toObject(['id']);
            set(ref(db, `pizarras/sala1/pagina_${window.paginaActual}/${obj.id}`), data);
        }
    });

    canvas.on('object:removed', (e) => {
        if (isImporting) return;
        const obj = e.target;
        if (obj.id) {
            const itemRef = ref(db, `pizarras/sala1/pagina_${window.paginaActual}/${obj.id}`);
            remove(itemRef); 
        }
    });

    // --- RECIBIR DATOS DE FIREBASE ---
    window.escucharCambios = () => {
        const currentRef = ref(db, `pizarras/sala1/pagina_${window.paginaActual}`);
        
        onChildAdded(currentRef, (snapshot) => {
            const data = snapshot.val();
            const exists = canvas.getObjects().find(o => o.id === data.id);
            if (!exists) {
                isImporting = true;
                fabric.util.enlivenObjects([data], (objects) => {
                    objects.forEach(obj => {
                        // Limpiamos la mancha también al recibir
                        if (obj.type === 'path') obj.set({ fill: null });
                        canvas.add(obj);
                    });
                    isImporting = false;
                    canvas.renderAll();
                });
            }
        });

        onChildChanged(currentRef, (snapshot) => {
            const data = snapshot.val();
            const obj = canvas.getObjects().find(o => o.id === data.id);
            if (obj) {
                isImporting = true;
                obj.set(data);
                if (obj.type === 'path') obj.set({ fill: null });
                obj.setCoords(); 
                canvas.renderAll();
                isImporting = false;
            }
        });

        onChildRemoved(currentRef, (snapshot) => {
            const data = snapshot.val();
            const objABorrar = canvas.getObjects().find(o => o.id === data.id);
            if (objABorrar) {
                isImporting = true;
                canvas.remove(objABorrar);
                canvas.renderAll();
                isImporting = false;
            }
        });
    };

    window.escucharCambios();
}