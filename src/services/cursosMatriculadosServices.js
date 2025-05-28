import axios from "axios";
import Swal from "sweetalert2";
import { OBTENER_CURSOS_MATRICULADOS, INSERTAR_CURSO_MATRICULADO, ELIMINAR_CURSO_MATRICULADO, OBTENER_AUSENCIAS, AGREGAR_NOTA, AGREGAR_AUSENCIAS  } from "../assets/Api/apiLinks";

export async function obtenerCursosMatriculados(id) {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_CURSOS_MATRICULADOS + id };

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

export async function insertarCursoMatriculado(curso) {

    if (curso.nota === "") {
        curso.nota = null;
    }

    const options = { method: "POST", withCredentials: false, url: INSERTAR_CURSO_MATRICULADO, data: curso };

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

export async function eliminarCursoMatriculado(id) {
    const options = { method: "DELETE", withCredentials: false, url: ELIMINAR_CURSO_MATRICULADO + id };

    return await axios
        .request(options).then(function (response) {
            return { success: true, message: response.data.message };
        }).catch(function (error) {
            return { success: false, message: error.response?.data?.message };
        });
}


export async function obtenerAusencias(id) {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_AUSENCIAS + id };

    return await axios.request(options).then(function (response) {
        return response.data;
    }).catch((error) => {
        alert(error);
        Swal.fire({
            icon: "error",
            title: error.response?.data?.message,
            showConfirmButton: false,
            timer: 1500
        });
        return [];
    });
}

export async function agregarNota(id, nota) {

    const options = { method: "PUT", withCredentials: false, url: AGREGAR_NOTA + id, data: { nota } };

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
export async function agregarAusencias(id, justificadas, injustificadas) {

    const options = { method: "PUT", withCredentials: false, url: AGREGAR_AUSENCIAS + id, data: { justificadas, injustificadas } };

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
