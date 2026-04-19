import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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
const trazosRef = ref(db, 'trazos');

// Enviar trazos (ahora pasamos isEraser)
window.broadcastStroke = function(x0, y0, x1, y1, color, width, isEraser) {
    push(trazosRef, { x0, y0, x1, y1, color, width, isEraser });
};

// Escuchar trazos nuevos
onChildAdded(trazosRef, (snapshot) => {
    const trazo = snapshot.val();
    if (typeof window.drawExternally === 'function') {
        window.drawExternally(
            trazo.x0, 
            trazo.y0, 
            trazo.x1, 
            trazo.y1, 
            trazo.color, 
            trazo.width,
            trazo.isEraser // El borrador funciona remotamente
        );
    }
});

// Borrar la base de datos completa
window.clearGlobalCanvas = function() {
    remove(trazosRef); 
};

// Escuchar si alguien vació la base de datos
onValue(trazosRef, (snapshot) => {
    if (!snapshot.exists()) {
        if (typeof window.clearLocalCanvas === 'function') {
            window.clearLocalCanvas();
        }
    }
});