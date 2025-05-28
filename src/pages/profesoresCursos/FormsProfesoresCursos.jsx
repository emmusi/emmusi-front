import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import FormCursos from "./formCursos";
import FormProfesores from "./formProfesores";

export default function FormProfesoresCursosHorarios() {
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo"); // 'curso' o 'profesor'
  const id = searchParams.get("id");

  return (
    <>
      <Navbar />
      <div className="grid sm:grid-cols-2 w-full h-auto mt-3 gap-10">

        <div className="flex flex-col justify-center">
          {/* Solo pasar el id si tipo es 'profesor' */}
          <FormProfesores id={tipo === "profesor" ? id : null} />
        </div>

        <div className="flex flex-col justify-center">
          {/* Solo pasar el id si tipo es 'curso' */}
          <FormCursos id={tipo === "curso" ? id : null} />
        </div>

      </div>
    </>
  );
}
