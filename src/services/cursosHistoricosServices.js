import axios from "axios";
import Swal from "sweetalert2";
import { OBTENER_CURSOS_HISTORICOS, INSERTAR_CURSO_HISTORICO } from "../assets/Api/apiLinks";

export async function obtenerCursosHistoricos(id) {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_CURSOS_HISTORICOS + id };

    return await axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        Swal.fire({
            icon: "error",
            title: error.response?.data?.message,
            showConfirmButton: false,
            timer: 1500
        });
        return [];
    });
}

export async function insertarCursoHistorico(id) {

    const options = { method: "POST", withCredentials: false, url: INSERTAR_CURSO_HISTORICO + id };

    return await axios
        .request(options)
        .then((response) => {
            // Mostrar mensaje de éxito del backend
            return { success: true, message: response.data.message };
        })
        .catch((error) => {
            // Capturar el mensaje del backend en caso de error
            return { success: false, message: error.response?.data?.message };
        });
}