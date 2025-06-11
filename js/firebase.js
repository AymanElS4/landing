// Importar funciones desde el CDN de Firebase v11.9.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase usando variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a la base de datos en tiempo real
const database = getDatabase(app);

// Función para guardar un voto
export const saveVote = (productID) => {
  const votesRef = ref(database, 'votes');
  const newVoteRef = push(votesRef);
  const voteData = {
    productID: productID,
    date: new Date().toISOString()
  };

  return set(newVoteRef, voteData)
    .then(() => ({
      success: true,
      message: "Voto guardado correctamente."
    }))
    .catch((error) => ({
      success: false,
      message: `Error al guardar el voto: ${error.message}`
    }));
};

// Función para obtener los votos
export const getVotes = async () => {
  const votesRef = ref(database, 'votes');
  try {
    const snapshot = await get(votesRef);
    if (snapshot.exists()) {
      return {
        success: true,
        body: snapshot.val()
      };
    } else {
      return {
        success: true,
        body: {}
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error al obtener los votos: ${error.message}`
    };
  }
};

