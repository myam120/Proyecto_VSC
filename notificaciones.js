// notificaciones.js

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    console.warn("Este navegador no soporta notificaciones.");
    return;
  }

  // Pedir permiso al usuario
  Notification.requestPermission().then((permiso) => {
    if (permiso === "granted") {
      console.info("✅ Permiso para notificaciones concedido.");

      // Crear una notificación de bienvenida
      const titulo = "Mi Notificación";
      const opciones = {
        body: "Bienvenido a nuestro programa de fidelización. Gracias por usar nuestro programa.",
        icon: "./images/notificacion.png",
        badge: "./images/notificacion.png"
      };

      const notificacion = new Notification(titulo, opciones);

      // Cerrar la notificación automáticamente después de 5 segundos
      setTimeout(() => notificacion.close(), 5000);
    } else if (permiso === "denied") {
      console.warn("🚫 El usuario denegó las notificaciones.");
    } else {
      console.log("ℹ️ Permiso de notificaciones en estado:", permiso);
    }
  });
});
