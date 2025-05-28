import axios from "axios";
import { VALIDAR_CREDENCIALES } from "../assets/Api/apiLinks";

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
