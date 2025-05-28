import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import ListaEstudianteCursosMatriculados from "./listaEstudianteCursosMatriculados";
import ListaEstudianteCursosHistoricos from "./listaEstudianteCursosHistoricos";
import { obtenerUnEstudiante } from '../../services/estudianteServices';
import Swal from "sweetalert2";

export default function ListaEstudianteCursos() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [estudiante, setEstudiante] = useState({
    id: "",
    cedula: "",
    nombre: "",
    telefono: "",
    especialidad: "",
    subespecialidad: "",
  });

  const [historicosActualizados, setHistoricosActualizados] = useState(false);

  const actualizarHistoricos = () => {
    setHistoricosActualizados(prev => !prev);
  };

  useEffect(() => {
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
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className='flex flex-col gap-20'>
        <ListaEstudianteCursosMatriculados
          id={id}
          estudiante={estudiante}
          onCursoPasadoAHistorico={actualizarHistoricos}
        />
        <ListaEstudianteCursosHistoricos
          id={id}
          estudiante={estudiante}
          actualizarTrigger={historicosActualizados}
        />
      </div>
    </>
  );
}

