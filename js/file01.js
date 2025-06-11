"use strict";
import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js'; // Importar getVotes

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

// Definir la función displayVotes
const displayVotes = async () => {
    const results = document.getElementById('results');
    if (!results) return;

    const votes = await getVotes();
    // Contar votos por producto
    const voteCounts = {};
    votes.forEach(vote => {
        if (vote.productID in voteCounts) {
            voteCounts[vote.productID]++;
        } else {
            voteCounts[vote.productID] = 1;
        }
    });

    // Crear tabla
    let table = `<table class="min-w-full text-left text-sm">
        <thead><tr><th class="px-4 py-2">Producto</th><th class="px-4 py-2">Total de votos</th></tr></thead>
        <tbody>`;
    Object.entries(voteCounts).forEach(([product, count]) => {
        table += `<tr><td class="border px-4 py-2">${product}</td><td class="border px-4 py-2">${count}</td></tr>`;
    });
    table += `</tbody></table>`;

    results.innerHTML = table;
};

const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('select_product');
            if (input) {
                const value = input.value;
                await saveVote(value);
                form.reset();
                await displayVotes(); // Mostrar votos después de guardar
            }
        });
    }
};

const loadData = async () => {

    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
            renderData(result.body.data);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

    } catch (error) {

        console.error('Ocurrió un error inesperado:', error);

    }

};


const renderData = (data) => {
    const container = document.getElementById("skeleton-container");
    if (container) {
        container.innerHTML = ''; // Limpiar contenido previo
        data.slice(0, 3).forEach(item => {
            const card = `
                <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h2 class="text-xl font-bold mb-2">${item.title}</h2>
                    <p class="text-gray-600 mb-1"><span class="font-semibold">Autor:</span> ${item.author}</p>
                    <p class="text-gray-500 mb-2"><span class="font-semibold">Género:</span> ${item.genre}</p>
                    <p class="text-gray-700">${item.content}</p>
                </div>
            `;
            container.innerHTML += card;
        });
    }
};

(() => {
    showtoast();
    showVideo();
    loadData();
    enableForm(); // Invocar la función enableForm
    displayVotes(); // Invocar la función displayVotes al cargar
})();