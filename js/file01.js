"use strict";

import { fetchFakerData } from './functions.js';
import { saveVote } from './firebase.js';
import { getVotes } from './firebase.js';
import { saveReserva } from './firebase.js';




const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
    
}

const displayVotes = async () => {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    // Obtener los votos usando la función getVotes
    const result = await getVotes();

    if (!result.success || !result.body) {
        resultsContainer.innerHTML = "<p class='text-red-600'>No se pudieron cargar los votos.</p>";
        return;
    }

    // Contar votos por producto
    const votos = result.body;
    const conteo = {};

    Object.values(votos).forEach(voto => {
        if (voto.productID) {
            conteo[voto.productID] = (conteo[voto.productID] || 0) + 1;
        }
    });

    // Crear la tabla
    let tabla = `
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
                <tr>
                    <th class="py-2 px-4 border-b">Producto</th>
                    <th class="py-2 px-4 border-b">Total de votos</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(conteo).forEach(([producto, total]) => {
        tabla += `
            <tr>
                <td class="py-2 px-4 border-b">${producto}</td>
                <td class="py-2 px-4 border-b text-center">${total}</td>
            </tr>
        `;
    });

    tabla += `
            </tbody>
        </table>
    `;

    resultsContainer.innerHTML = tabla;
};

const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const select = document.getElementById('select_product');
        if (!select) return;

        const productID = select.value;

        await saveVote(productID);

        // Limpia el formulario
        form.reset();

        // Mostrar los votos actualizados
        displayVotes();
    });
};

// Función para extraer y guardar los datos del formulario de reserva
const handleReservaForm = () => {
  const form = document.getElementById('form_reserva');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Extraer datos del formulario
    const email = form.email.value;
    const mensaje = form.mensaje.value;
    const especificaciones = form.especificaciones.value;
    const horario = form.horario.value;

    // Extraer servicios seleccionados (checkboxes)
    const servicios = [];
    if (form.querySelector('#puentes-checkbox').checked) servicios.push('puentes');
    if (form.querySelector('#coronas-checkbox').checked) servicios.push('coronas');
    if (form.querySelector('#protesis-checkbox').checked) servicios.push('protesis');

    // Construir objeto de reserva
    const reservaData = {
      email,
      mensaje,
      especificaciones,
      horario,
      servicios
    };

    // Guardar en Firebase
    const result = await saveReserva(reservaData);

    if (result.success) {
      alert('Reserva guardada correctamente.');
      displayContentReserva(reservaData);
      form.reset();
    } else {
      alert('Error al guardar la reserva: ' + result.message);
    }
  });
}

// Función para mostrar el contenido de la reserva en la sección correspondiente
function displayContentReserva({ email, mensaje, especificaciones, horario, servicios }) {
  const datosSection = document.getElementById('datos-formulario');
  const datosContenido = document.getElementById('datos-contenido');
  if (!datosContenido) {
    console.log('No se encontró el div con id="datos-contenido"');
    return;
  }
  datosContenido.innerHTML = `
    <div><strong>Correo electrónico:</strong> ${email}</div>
    <div><strong>Mensaje:</strong> ${mensaje}</div>
    <div><strong>Especificaciones:</strong> ${especificaciones}</div>
    <div><strong>Horario preferido:</strong> ${horario.charAt(0).toUpperCase() + horario.slice(1)}</div>
    <div><strong>Servicios:</strong> ${servicios && servicios.length > 0 ? servicios.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : 'Ninguno'}</div>
  `;
  if (datosSection) {
    datosSection.classList.remove('hidden');
    datosSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Invoca las funciones en la autoejecución
(() => {
    showVideo();
    enableForm();
    displayVotes();
    handleReservaForm();
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


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contacto form');
  const datosSection = document.getElementById('datos-formulario');
  const datosContenido = document.getElementById('datos-contenido');

  if (form && datosSection && datosContenido) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = form.email.value;
      const mensaje = form.mensaje.value;
      const especificaciones = form.especificaciones.value;
      const servicio = form.servicio.value;

      datosContenido.innerHTML = `
        <div><strong>Correo electrónico:</strong> ${email}</div>
        <div><strong>Mensaje:</strong> ${mensaje}</div>
        <div><strong>Especificaciones:</strong> ${especificaciones}</div>
        <div><strong>Tipo de servicio:</strong> ${servicio.charAt(0).toUpperCase() + servicio.slice(1)}</div>
      `;
      datosSection.classList.remove('hidden');
      datosSection.scrollIntoView({ behavior: 'smooth' });
      form.reset();
    });
  }
});

// Mostrar estado de contacto (abierto/cerrado) usando la API de timeapi.io
document.addEventListener('DOMContentLoaded', async () => {
  const estadoEl = document.getElementById('estado-laboratorio');
  if (!estadoEl) return;

  try {
    // Usamos la API de timeapi.io para obtener la hora de Santiago, Chile
    const resp = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Santiago');
    const data = await resp.json();
    const hora = data.hour; // La API devuelve la hora directamente

    // Laboratorio abierto de 8:00 a 18:00
    if (hora >= 8 && hora < 18) {
      estadoEl.textContent = "¡Estamos Abiertos!";
      estadoEl.className = "text-blue-600 font-semibold";
    } else {
      estadoEl.textContent = "Cerrado en este momento";
      estadoEl.className = "text-red-600 font-semibold";
    }
  } catch (error) {
    estadoEl.textContent = "No se pudo obtener el estado actual.";
    estadoEl.className = "text-red-600 font-semibold";
  }
});


