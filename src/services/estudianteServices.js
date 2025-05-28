import axios from "axios";
import Swal from "sweetalert2";
import { OBTENER_ESTUDIANTES, OBTENER_UN_ESTUDIANTE, INSERTAR_ESTUDIANTE, ACTUALIZAR_ESTUDIANTE, ELIMINAR_ESTUDIANTE } from "../assets/Api/apiLinks";

export async function obtenerEstudiantes() {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_ESTUDIANTES };

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

export async function obtenerUnEstudiante(id) {
    const options = { method: "GET", withCredentials: false, url: OBTENER_UN_ESTUDIANTE + id };

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

export async function insertarEstudiante(estudiante) {
    const options = { method: "POST", withCredentials: false, url: INSERTAR_ESTUDIANTE, data: estudiante };
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


export async function actualizarEstudiante(id, estudiante) {
    const options = { method: "PUT", withCredentials: false, url: ACTUALIZAR_ESTUDIANTE + id, data: estudiante };

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

export async function eliminarEstudiante(id) {
    const options = { method: "DELETE", withCredentials: false, url: ELIMINAR_ESTUDIANTE + id };

    return await axios
        .request(options).then(function (response) {
            return { success: true, message: response.data.message };
        }).catch(function (error) {
            return { success: false, message: error.response?.data?.message };
        });
}