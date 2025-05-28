import axios from "axios";
import Swal from "sweetalert2";
import { OBTENER_CURSOS, OBTENER_UN_CURSO, INSERTAR_CURSO, ACTUALIZAR_CURSO, ELIMINAR_CURSO } from "../assets/Api/apiLinks";

export async function obtenerCursos() {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_CURSOS };

    return await axios.request(options).then(function (response) {
        return response.data;
    }).catch(async (error) => {
       await Swal.fire({
            icon: "error",
            title: error.response?.data?.message,
            showConfirmButton: false,
            timer: 1500
        });
        return [];
    });
}

export async function obtenerUnCurso(id) {
    const options = { method: "GET", withCredentials: false, url: OBTENER_UN_CURSO + id };

    return await axios.request(options).then(function (response) {
        return response.data[0];
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

export async function insertarCurso(curso) {
    const options = { method: "POST", withCredentials: false, url: INSERTAR_CURSO, data: curso };

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


export async function actualizarCurso(id, curso) {
    const options = { method: "PUT", withCredentials: false, url: ACTUALIZAR_CURSO + id, data: curso };

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

export async function eliminarCurso(id) {
    const options = { method: "DELETE", withCredentials: false, url: ELIMINAR_CURSO + id };

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