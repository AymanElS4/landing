"use strict";

import { fetchFakerData } from './functions.js';

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

const showtoast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast){
        toast.classList.add("md:block");
    }
}
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
    
}

(() => {
    showtoast();
    showVideo();
    
})();
let renderCards = (data) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;

    // Limpiar el contenedor antes de renderizar nuevas tarjetas
    container.innerHTML = "";

    data.slice(0, 3).forEach(item => {
        const card = `
            <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${item.title}</h3>
                <p class="text-gray-700 mb-1"><span class="font-medium">Autor:</span> ${item.author}</p>
                <p class="text-gray-700 mb-1"><span class="font-medium">Género:</span> ${item.genre}</p>
                <p class="text-gray-600 mt-2">${item.content}</p>
            </div>
        `;
        container.innerHTML += card;
    });
};

let loadData = async () => {
    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
            renderCards(result.body.data);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

    } catch (error) {

        console.error('Ocurrió un error inesperado:', error);

    }
};
(() => {
    loadData();
    
})();

