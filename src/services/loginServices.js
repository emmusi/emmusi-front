import axios from "axios";
import { VALIDAR_CREDENCIALES, RECORDAR_CREDENCIALES } from "../assets/Api/apiLinks";
import Swal from "sweetalert2";

export async function validarCredenciales(usuario) {
  const options = {
    method: "POST",
    withCredentials: false,
    url: VALIDAR_CREDENCIALES,
    data: usuario,
  };

  return await axios
    .request(options)
    .then((response) => {
      localStorage.setItem("userToken", "usuario-logueado"); // puedes guardar un token real aquí
      return { success: true };
    })
    .catch((error) => {
      return { success: false, message: error.response?.data?.message || "Error al iniciar sesión" };
    });
}

export async function recordarCredenciales() {
  const options = { method: "GET", withCredentials: false, url: RECORDAR_CREDENCIALES };

  return await axios
    .request(options)
    .then((response) => {
      // Mostrar mensaje de éxito del backend
      Swal.fire({
        icon: "success",
        title:response.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      return { success: true, message: response.data.message };
    })
    .catch((error) => {
      // Capturar el mensaje del backend en caso de error
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message,
        showConfirmButton: false,
        timer: 1500
      });
    });
}
