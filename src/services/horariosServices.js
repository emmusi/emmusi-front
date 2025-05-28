import axios from "axios";
import Swal from "sweetalert2";
import { OBTENER_HORARIOS, OBTENER_UN_HORARIO, INSERTAR_HORARIO, ACTUALIZAR_HORARIO, ELIMINAR_HORARIO, OBTENER_HORARIOS_POR_CURSO } from "../assets/Api/apiLinks";

export async function obtenerHorarios() {
    const options = { method: 'GET', withCredentials: false, url: OBTENER_HORARIOS };

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

export async function obtenerUnHorario(id) {
    const options = { method: "GET", withCredentials: false, url: OBTENER_UN_HORARIO + id };

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

export async function insertarHorario(horario) {
    const options = { method: "POST", withCredentials: false, url: INSERTAR_HORARIO, data: horario };

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


export async function actualizarHorario(id, horario) {
    const options = { method: "PUT", withCredentials: false, url: ACTUALIZAR_HORARIO + id, data: horario };

    return await axios
        .request(options)
        .then(function (response) {
            return { success: true, message: response.data.message };
        })
        .catch((error) => {
            // Capturar el mensaje del backend en caso de error
            return { success: false, message: error.response?.data?.message };
        });
}

export async function eliminarHorario(id) {
    const options = { method: "DELETE", withCredentials: false, url: ELIMINAR_HORARIO + id };

    return await axios
        .request(options)
        .then(function (response) {
            return { success: true, message: response.data.message };
        })
        .catch((error) => {
            // Capturar el mensaje del backend en caso de error
            return { success: false, message: error.response?.data?.message };
        });
}

export async function obtenerHorariosPorCurso(id) {
    const options = { method: "GET", withCredentials: false, url: OBTENER_HORARIOS_POR_CURSO + id };

    return await axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        Swal.fire({
            icon: "error",
            title: error.response?.data?.message,
            showConfirmButton: false,
            timer: 1500
        });
    });
}