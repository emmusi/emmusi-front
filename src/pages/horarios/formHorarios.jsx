import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { insertarHorario, obtenerUnHorario, actualizarHorario } from "../../services/horariosServices";
import { obtenerProfesores } from "../../services/profesoresServices";
import { obtenerCursos } from "../../services/cursosServices";
import InputConValidacion from "../../components/inputConValidacion";
import SelectConValidacion from "../../components/selectConValidacion";
import InputHoraConValidacion from "../../components/inputHoraConValidacion";
import Navbar from "../../components/navbar/navbar";
import SelectConFiltro from "../../components/selectConFiltro";
import Swal from "sweetalert2";

export default function FormHorarios() {
  const [formData, setFormData] = useState({
    idCurso: "",
    idProfesor: "",
    dia: "",
    horaInicio: "",
    horaFin: "",
    ciclo: "",
  });

  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);


  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    // Obtener lista de profesores
    obtenerProfesores()
      .then((data) => {
        const profesoresConOpcionVacia = [{ id: "", nombre: "Seleccione una opción" }, ...(data || [])];
        setProfesores(profesoresConOpcionVacia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al obtener profesores",
          showConfirmButton: false,
          timer: 1500
        })
      });

    // Obtener lista de cursos
    obtenerCursos()
      .then((data) => {
        const cursosConOpcionVacia = [{ id: "", nombre: "Seleccione una opción" }, ...(data || [])];
        setCursos(cursosConOpcionVacia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al obtener cursos",
          showConfirmButton: false,
          timer: 1500
        })
      });

    // Si hay un ID, obtener el horario correspondiente
    if (id) {
      obtenerUnHorario(id)
        .then((data) => {
          setFormData({
            idCurso: data.idCurso || "",
            idProfesor: data.idProfesor || "",
            dia: data.dia || "",
            horaInicio: data.horaInicio || "",
            horaFin: data.horaFin || "",
            ciclo: data.ciclo || "",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al obtener el horario",
            showConfirmButton: false,
            timer: 1500
          })
        });
    } else {
      setFormData({
        idCurso: "",
        idProfesor: "",
        dia: "",
        horaInicio: "",
        horaFin: "",
        ciclo: "",
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
      actualizarHorario(id, formData)
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
            title: "Error al actualizar el horario.",
            showConfirmButton: false,
            timer: 1500
          });
        });
    } else {
      insertarHorario(formData)
        .then((response) => {
          if (response.success) {
            setFormData({
              idCurso: "",
              idProfesor: "",
              dia: "",
              horaInicio: "",
              horaFin: "",
              ciclo: "",
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
            title: "Error al registrar el curso.",
            showConfirmButton: false,
            timer: 1500
          });

        });
    }
  };



  return (
    <>
      <Navbar />
      <div className="h-auto flex flex-col items-center justify-center text-center mt-16 sm:mt-3 ">
        <p className="text-5xl font-semibold mb-12">Formulario de Horarios</p>

        <div className="w-full flex items-center justify-center">
          <form onSubmit={handleSubmit} className=" bg-white px-10 py-6 rounded-3xl border-2">

            <SelectConFiltro
              id="idCurso"
              name="curso"
              label="Curso"
              value={formData.idCurso}
              onChange={handleChange}
              requerido
              options={cursos}
              selectClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.idCurso}
            />

            <SelectConFiltro
              id="idProfesor"
              name="profesor"
              label="Profesor"
              value={formData.idProfesor}
              onChange={handleChange}
              requerido
              options={profesores}
              selectClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.idProfesor}
            />

            <SelectConValidacion
              id="dia"
              name="dia"
              label="Día"
              value={formData.dia}
              onChange={handleChange}
              requerido
              options={[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes"
              ]}
              selectClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.dia}
            />

            <InputHoraConValidacion
              id="horaInicio"
              name="horaInicio"
              label="Hora de Inicio"
              value={formData.horaInicio}
              onChange={handleChange}
              requerido
              inputClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.horaInicio}
            />


            <InputHoraConValidacion
              id="horaFin"
              name="horaFin"
              label="Hora de Fin"
              value={formData.horaFin}
              onChange={handleChange}
              requerido
              inputClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.horaFin}
            />


            <InputConValidacion
              id="ciclo"
              name="ciclo"
              label="Ciclo"
              value={formData.ciclo}
              onChange={handleChange}
              placeholder="Ingrese el clico"
              requerido
              validacion="ciclo"
              inputProps={{
                maxLength: 50,
              }}
              inputClassName="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.ciclo} // Pasamos el error aquí
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

