import { useState, useEffect } from "react";
import { insertarProfesor, obtenerUnProfesor, actualizarProfesor } from "../../services/profesoresServices"
import InputConValidacion from "../../components/inputConValidacion";
import Swal from "sweetalert2";

export default function FormProfesores({ id }) {
  const [formData, setFormData] = useState({
    nombre: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {

    if (id) {
      obtenerUnProfesor(id)
        .then((data) => {
          setFormData({

            nombre: data.nombre || "",

          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al obtener el Profesor.",
            showConfirmButton: false,
            timer: 1500
          });

        });
    } else {
      setFormData({
        nombre: "",
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (id) {
      actualizarProfesor(id, formData)
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
            title: "Error al actualizar el Profesor.",
            showConfirmButton: false,
            timer: 1500
          });
        });
    } else {
      insertarProfesor(formData)
        .then((response) => {
          if (response.success) {
            Swal.fire({
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
            setFormData({
              nombre: "",
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
            title: "Error al registrar el Profesor.",
            showConfirmButton: false,
            timer: 1500
          });

        });
    }
  };

  return (
    <>
      <div className="h-auto flex flex-col items-center justify-center text-center ">
        <p className="text-5xl font-semibold mb-12 mt-12 ">Formulario de Profesores</p>
        <div className="w-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className=" bg-white px-10 py-10 rounded-3xl border-2"
          >
            <InputConValidacion
              id="nombre"
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
              requerido
              validacion="texto"
              inputProps={{
                maxLength: 50,
              }}
              inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.nombre} // Pasamos el error aquí
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



