// Importamos Firebase directamente desde su CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Tu configuración exacta de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEnbavhYXz-WCI_2OyknC_Mpnp-_aM23c",
  authDomain: "tablon-charlianx.firebaseapp.com",
  databaseURL: "https://tablon-charlianx-default-rtdb.firebaseio.com",
  projectId: "tablon-charlianx",
  storageBucket: "tablon-charlianx.firebasestorage.app",
  messagingSenderId: "452711415042",
  appId: "1:452711415042:web:cfb4a1b37a8c4dede3561b"
};

// 1. Inicializar la aplicación y la base de datos
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const trazosRef = ref(db, 'trazos');

// 2. Función para ENVIAR trazos a Firebase (la llama canvas.js)
window.broadcastStroke = function(x0, y0, x1, y1, color, width) {
    push(trazosRef, {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: color,
        width: width
    });
};

// 3. Función para ESCUCHAR los trazos que llegan de Firebase
onChildAdded(trazosRef, (snapshot) => {
    const trazo = snapshot.val();
    
    // Si la función drawExternally existe en canvas.js, dibujamos la línea
    if (typeof window.drawExternally === 'function') {
        window.drawExternally(
            trazo.x0, 
            trazo.y0, 
            trazo.x1, 
            trazo.y1, 
            trazo.color, 
            trazo.width
        );
    }
});