import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { insertarEstudiante, obtenerUnEstudiante, actualizarEstudiante, } from "../../services/estudianteServices";
import InputConValidacion from "../../components/inputConValidacion";
import Navbar from "../../components/navbar/navbar";
import Swal from "sweetalert2";
export default function FormEstudiante() {
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    especialidad: "",
    subespecialidad: "",
  });

  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {

    if (id) {
      obtenerUnEstudiante(id)
        .then((data) => {
          setFormData({
            cedula: data.cedula || "",
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            especialidad: data.especialidad || "",
            subespecialidad: data.subespecialidad || "",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al obtener la informacion del estudiante",
            showConfirmButton: false,
            timer: 1500
          });

        });
    } else {
      setFormData({
        cedula: "",
        nombre: "",
        telefono: "",
        especialidad: "",
        subespecialidad: "",
      });
      setErrors({});
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });

    if (formData.cedula.trim() && !/^\d{9}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener exactamente 9 dígitos";
    }

    if (formData.telefono.trim() && !/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener exactamente 8 dígitos";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (id) {
      actualizarEstudiante(id, formData)
        .then((response) => {
          
          if (response.success) {
            Swal.fire({
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
          }

        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al actualizar el estudiante",
            showConfirmButton: false,
            timer: 1500
          });
        });
    } else {
      insertarEstudiante(formData)
        .then((response) => {
          if (response.success) {
            setFormData({
              cedula: "",
              nombre: "",
              telefono: "",
              especialidad: "",
              subespecialidad: "",
            });
            Swal.fire({
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
          }

        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al registrar el estudiante",
            showConfirmButton: false,
            timer: 1500
          });
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-auto ml-auto mr-auto flex flex-col items-center justify-center text-center">
        <label className="text-5xl font-semibold mb-12 mt-12 lg:mt-0">
          Formulario de los Estudiantes
        </label>

        <div className="w-full flex items-center justify-center lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-white px-8 pt-6 pb-8 mb-4 rounded-3xl border-2"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <InputConValidacion
                id="cedula"
                name="cedula"
                label="Cédula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Ingrese el número de cédula"
                requerido
                validacion="numero"
                inputProps={{ maxLength: 9 }}
                inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                labelClassName="block text-gray-700 text-sm font-bold mb-2"
                error={errors.cedula}
              />

              <InputConValidacion
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                requerido
                validacion="texto"
                inputProps={{ maxLength: 50 }}
                inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                labelClassName="block text-gray-700 text-sm font-bold mb-2"
                error={errors.nombre}
              />
            </div>

            <InputConValidacion
              id="telefono"
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ingrese el número de teléfono"
              requerido
              validacion="numero"
              inputProps={{ maxLength: 8 }}
              inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.telefono}
            />

            <InputConValidacion
              id="especialidad"
              name="especialidad"
              label="Especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              placeholder="Ingrese la especialidad"
              requerido
              validacion="alfanumerico"
              inputProps={{ maxLength: 50 }}
              inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.especialidad}
            />

            <InputConValidacion
              id="subespecialidad"
              name="subespecialidad"
              label="Subespecialidad"
              value={formData.subespecialidad}
              onChange={handleChange}
              placeholder="Ingrese la subespecialidad"
              requerido
              validacion="alfanumerico"
              inputProps={{ maxLength: 50 }}
              inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.subespecialidad}
            />

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                type="submit"
                className="py-2 rounded-xl bg-blue-500 text-white text-lg font-bold hover:scale-[1.01] active:scale-[.98]"
              >
                {id ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

