import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Login from "../pages/login/login";
import ListaEstudiantes from "../pages/estudiantes/listaEstudiantes";
import FormEstudiante from "../pages/estudiantes/formEstudiante";
import ListaProfesores from "../pages/profesoresCursos/listaProfesores";
import ListaCursos from "../pages/profesoresCursos/listaCursos";
import FormProfesoresCursosHorarios from "../pages/profesoresCursos/FormsProfesoresCursos";
import FormHorarios from "../pages/horarios/formHorarios";
import ListaHorarios from "../pages/horarios/listaHorarios";
import FormMatriculacion from "../pages/estudiantes/matricularEstudiante";
import ListaEstudianteCursos from "../pages/estudiantes/listaEstudianteCursos";
import NotasAusencias from "../pages/estudiantes/notasAusencias";


const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos

const PublicRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("userToken"));

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      if (isAuthenticated) {
        logoutTimer = setTimeout(() => {
          localStorage.removeItem("userToken");
          setIsAuthenticated(false); // <-- actualizar estado
          window.location.href = "/";
        }, LOGOUT_TIME);
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/estudiantes/listaEstudiantes" element={<ListaEstudiantes />} />
          <Route path="/estudiantes/registro" element={<FormEstudiante />} />
          <Route path="/profesores/listaProfesores" element={<ListaProfesores />} />
          <Route path="/formsProfesoresCursos/registro" element={<FormProfesoresCursosHorarios />} />
          <Route path="/horarios/registro" element={<FormHorarios />} />
          <Route path="/cursos/listaCursos" element={<ListaCursos />} />
          <Route path="/horarios/listaHorarios" element={<ListaHorarios />} />
          <Route path="/estudiantes/matricularEstudiante" element={<FormMatriculacion />} />
          <Route path="/estudiantes/listaEstudianteCursos" element={<ListaEstudianteCursos />} />
          <Route path="/estudiantes/notasAusencias" element={<NotasAusencias />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PublicRoutes;


