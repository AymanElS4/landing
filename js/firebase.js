// Importa los módulos de Firebase desde el CDN (si usas Vite, puedes usar import dinámico o script en index.html)
// Importar funciones desde el CDN de Firebase v11.9.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase usando variables de entorno de Vite (prefijadas con VITE_FIREBASE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de la base de datos en tiempo real
const database = getDatabase(app);

function saveVote(productID) {
  const db = getDatabase();
  const votesRef = ref(db, 'votes');        // Referencia a la colección 'votes'
  const newVoteRef = push(votesRef);        // Crea una nueva referencia única

  const voteData = {
    productID: productID,
    date: new Date().toISOString()
  };

  // Guarda los datos y maneja la promesa
  return set(newVoteRef, voteData)
    .then(() => {
      return { success: true, message: 'Voto guardado exitosamente.' };
    })
    .catch((error) => {
      return { success: false, message: 'Error al guardar el voto.', error: error };
    });
}

// Definir la función getVotes
async function getVotes() {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, 'votes'));
    if (snapshot.exists()) {
      // Retorna un array de votos
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los votos:", error);
    return [];
  }
}

export { saveVote, getVotes };