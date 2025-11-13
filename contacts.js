// contacts.js
const soportado = ('contacts' in navigator && 'ContactsManager' in window);
const button = document.getElementById("btnContactos");
const divContactos = document.getElementById("contactoSeleccionado");

const selectContacto = async () => {
  try {
    // Solicitar nombre y número de teléfono
    const contactos = await navigator.contacts.select(['name', 'tel'], {
      multiple: false
    });

    if (contactos.length > 0) {
      const contacto = contactos[0];
      divContactos.innerHTML = `
        👤 <b>${contacto.name ? contacto.name[0] : 'Sin nombre'}</b><br>
        📞 ${contacto.tel ? contacto.tel[0] : 'Sin número'}
      `;
    } else {
      divContactos.innerHTML = "No se seleccionó ningún contacto.";
    }
  } catch (error) {
    console.error("Error al seleccionar contacto:", error);
    divContactos.innerHTML = "No se pudo acceder a los contactos.";
  }
};

if (soportado) {
  console.log("Contact Picker soportado en este navegador.");
  button.addEventListener("click", selectContacto);
} else {
  console.warn("Contact Picker no soportado.");
  button.setAttribute('disabled', true);
  button.classList.add("grey");
  divContactos.innerHTML = "El navegador no soporta Contact Picker API.";
}
