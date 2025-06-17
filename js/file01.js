"use strict";

import { fetchFakerData } from './functions.js';
import { saveVote } from './firebase.js';
import { getVotes } from './firebase.js';
import { saveReserva } from './firebase.js';



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
    enableForm();

    handleReservaForm();
})();




/*
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
*/


// Mostrar estado de contacto (abierto/cerrado) usando la API de timeapi.io
document.addEventListener('DOMContentLoaded', async () => {
  const estadoEl = document.getElementById('estado-laboratorio');
  if (!estadoEl) return;

  try {
    // Usamos la API de timeapi.io para obtener la hora de Santiago, Chile
    const resp = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Guayaquil');
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