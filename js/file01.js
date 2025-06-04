"use strict";

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
    
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
    const demo = document.getElementById("demo");
}

(() => {
    showtoast();
    showVideo();
})();