import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarCredenciales } from "../../services/loginServices";
import Swal from "sweetalert2";

export default function Login({ setIsAuthenticated }) {
  const [credenciales, setCredenciales] = useState({ usuario: "", password: "" });
  const [errores, setErrores] = useState({ usuario: false, password: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Expresión regular que permite letras, números, guiones (-) y guiones bajos (_) y puntos (.).
    const regex = /^[a-zA-Z0-9._-]*$/;

    if (regex.test(value)) {
      setCredenciales({
        ...credenciales,
        [name]: value,
      });

      setErrores({
        ...errores,
        [name]: false, // Limpiar error cuando es válido
      });
    }
  };

  const handleLogin = async () => {
    const erroresNuevo = {
      usuario: !credenciales.usuario.trim(),
      password: !credenciales.password.trim(),
    };

    setErrores(erroresNuevo);

    if (erroresNuevo.usuario || erroresNuevo.password) {
      return;
    }

     validarCredenciales(credenciales).then((response) => {
      if (response.success) {
        setIsAuthenticated(true);
        navigate("/estudiantes/listaEstudiantes");
      } else {
        Swal.fire({
          icon: "error",
          title: response.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100">
          <h1 className="text-5xl font-semibold">Bienvenido</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">¡Por favor ingrese sus credenciales!</p>
          <div className="mt-8">
            <div>
              <label className="text-lg font-medium">
                Usuario <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border-2 rounded-xl p-4 mt-1 ${errores.usuario ? "border-red-500" : "border-gray-100"}`}
                placeholder="Ingrese su usuario"
                type="text"
                name="usuario"
                value={credenciales.usuario}
                onChange={handleChange}
              />
              {errores.usuario && <p className="text-red-500 text-sm">Este campo es obligatorio</p>}
            </div>

            <div>
              <label className="text-lg font-medium">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border-2 rounded-xl p-4 mt-1 ${errores.password ? "border-red-500" : "border-gray-100"}`}
                placeholder="Ingrese su contraseña"
                type="password"
                name="password"
                value={credenciales.password}
                onChange={handleChange}
              />
              {errores.password && <p className="text-red-500 text-sm">Este campo es obligatorio</p>}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button className="font-medium text-base text-violet-500 ml-4">¿Olvidó su contraseña?</button>
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-2 rounded-xl bg-violet-500 text-white text-lg font-bold"
                onClick={handleLogin}
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to bg-pink-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
