import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { insertarCursoMatriculado } from "../../services/cursosMatriculadosServices";
import { obtenerUnEstudiante } from "../../services/estudianteServices";
import { obtenerCursos } from "../../services/cursosServices";
import { obtenerHorariosPorCurso } from "../../services/horariosServices";
import Navbar from "../../components/navbar/navbar";
import SelectConFiltro from "../../components/selectConFiltro";
import InputConValidacion from "../../components/inputConValidacion";
import SelectConValidacion from "../../components/selectConValidacion";
import Swal from "sweetalert2";
export default function FormMatriculacion() {
  const [formData, setFormData] = useState({
    idEstudiante: "",
    idCurso: "",
    idHorario: "",
    ciclo: "",
    nota: "",
  });
  const [estudiante, setEstudiante] = useState({
    id: "",
    cedula: "",
    nombre: "",
    telefono: "",
    especialidad: "",
    subespecialidad: "",
  });

  const [cursos, setCursos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    // Obtener lista de cursos
    obtenerCursos()
      .then((data) => {
        const cursosConOpcionVacia = [{ id: "", nombre: "Seleccione una opción" }, ...(data || [])];
        setCursos(cursosConOpcionVacia);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al obtener la informacion del estudiante",
          showConfirmButton: false,
          timer: 1500
        });
      });

    // Si hay un ID, obtener el estudiante correspondiente
    if (id) {
      obtenerUnEstudiante(id)
        .then((data) => {
          setEstudiante({
            id: data.id || "",
            cedula: data.cedula || "",
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            especialidad: data.especialidad || "",
            subespecialidad: data.subespecialidad || ""

          }); setFormData((prev) => ({ ...prev, idEstudiante: id || "" }));


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
      setEstudiante({
        setEstudiante: "",
      });
      setErrors({});
    }
  }, [id]);


  const handleChange = async (e) => {
    const { id, value } = e.target;

    // Actualiza el campo modificado
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));

    // Cuando se selecciona un curso
    if (id === "idCurso") {
      setFormData((prev) => ({ ...prev, idHorario: "", ciclo: "" })); // Limpiar horario y ciclo
      try {
        if (value !== "") {
          const horariosCurso = await obtenerHorariosPorCurso(value);
          const horariosConOpcionVacia = [{ id: "", nombre: "Seleccione una opción" }, ...(horariosCurso || [])];
          setHorarios(horariosConOpcionVacia);
        } else {
          setHorarios([{ id: "", nombre: "Seleccione una opcion" }]);
        }

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al obtener horarios del curso.",
          showConfirmButton: false,
          timer: 1500
        });

        setHorarios([{ id: "", nombre: "Seleccione una opción" }]);
      }
    }

    // Cuando se selecciona un horario
    if (id === "idHorario") {
      const horarioSeleccionado = horarios.find((h) => h.id === value);
      const cicloDelHorario = horarioSeleccionado?.ciclo || "";
      setFormData((prev) => ({ ...prev, ciclo: cicloDelHorario }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    const camposRequeridos = ["idEstudiante", "idCurso", "idHorario", "ciclo"];

    camposRequeridos.forEach((key) => {
      const value = formData[key];

      if (typeof value !== "string" || !value.trim()) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    insertarCursoMatriculado(formData)
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
          title: "Error al matricular al estudiante.",
          showConfirmButton: false,
          timer: 1500
        });

      });
  };



  return (
    <>
      <Navbar />
      <div className="flex flex-col sm:flex-row  gap-8 sm:gap-10 lg:gap-60 w-fit m-auto my-10 ">
        <div className=''>
          <p className="font-medium text-lg ">Cédula: {estudiante.cedula}</p>
          <p className="font-medium text-lg ">Estudiante: {estudiante.nombre}</p>
        </div>
        <div className='bg-anaranjado-cuadro px-10 border-2 border-black'>
          <p className="font-medium text-lg ">Especialidad: {estudiante.especialidad}</p>
          <p className="font-medium text-lg ">Subespecialidad: {estudiante.subespecialidad}</p>
        </div>
      </div>
      
      <div className="h-auto flex flex-col items-center justify-center text-center mt-16 sm:mt-3 ">

        <p className="text-5xl font-semibold mb-12">Formulario de Matriculas</p>
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
              id="idHorario"
              name="horario"
              label="Horario"
              value={formData.idHorario}
              onChange={handleChange}
              requerido
              options={horarios}
              selectClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.idHorario}
            />

            <InputConValidacion
              id="ciclo"
              name="cedula"
              label="Ciclo"
              value={formData.ciclo}
              onChange={handleChange}
              placeholder=""
              requerido
              validacion="texto"
              inputProps={{ maxLength: 9 }}
              inputClassName=" shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.cedula}
              disabled={true}
            />


            <SelectConValidacion
              id="nota"
              name="nota"
              label="Estado"
              value={formData.nota}
              onChange={handleChange}
              requerido={false} // ya que es opcional
              options={[
                "Retiro Justificado",
                "No Oferta",
              ]}
              selectClassName="text-sm"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              error={errors.nota}
            />

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                type="submit"
                className="py-2 rounded-xl bg-blue-500 text-white text-lg font-bold hover:scale-[1.01] active:scale-[.98]"
              >
                Matricular
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

