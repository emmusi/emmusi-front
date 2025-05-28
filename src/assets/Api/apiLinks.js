const URL = 'http://localhost:444/api/';
const URL_USUARIOS = URL + 'usuarios/';
const URL_ESTUDIANTES = URL + 'estudiantes/';
const URL_PROFESORES = URL + 'profesores/';
const URL_CURSOS = URL + 'cursos/';
const URL_HORARIOS = URL + 'horarios/';
const URL_CURSOS_MATRICULADOS = URL + 'cursos-matriculados/';
const URL_CURSOS_HISTORICOS = URL + 'cursos-historicos/';


export const VALIDAR_CREDENCIALES = URL_USUARIOS + 'validarCredenciales';
export const RECORDAR_CREDENCIALES = URL_USUARIOS + 'recordarCredenciales';

export const OBTENER_ESTUDIANTES = URL_ESTUDIANTES + 'getEstudiantes';
export const OBTENER_UN_ESTUDIANTE = URL_ESTUDIANTES + 'getEstudiante/';
export const INSERTAR_ESTUDIANTE = URL_ESTUDIANTES + 'insertEstudiante';
export const ACTUALIZAR_ESTUDIANTE = URL_ESTUDIANTES + 'updateEstudiante/';
export const ELIMINAR_ESTUDIANTE = URL_ESTUDIANTES + 'deleteEstudiante/';

export const OBTENER_PROFESORES = URL_PROFESORES + 'getProfesores';
export const OBTENER_UN_PROFESOR = URL_PROFESORES + 'getProfesor/';
export const INSERTAR_PROFESOR = URL_PROFESORES + 'insertProfesor';
export const ACTUALIZAR_PROFESOR = URL_PROFESORES + 'updateProfesor/';
export const ELIMINAR_PROFESOR = URL_PROFESORES + 'deleteProfesor/';

export const OBTENER_CURSOS = URL_CURSOS + 'getCursos';
export const OBTENER_UN_CURSO = URL_CURSOS + 'getCurso/';
export const INSERTAR_CURSO = URL_CURSOS + 'insertCurso';
export const ACTUALIZAR_CURSO = URL_CURSOS + 'updateCurso/';
export const ELIMINAR_CURSO = URL_CURSOS + 'deleteCurso/';

export const OBTENER_HORARIOS = URL_HORARIOS + 'getHorarios';
export const OBTENER_UN_HORARIO = URL_HORARIOS + 'getHorario/';
export const INSERTAR_HORARIO = URL_HORARIOS + 'insertHorario';
export const ACTUALIZAR_HORARIO = URL_HORARIOS + 'updateHorario/';
export const ELIMINAR_HORARIO = URL_HORARIOS + 'deleteHorario/';
export const OBTENER_HORARIOS_POR_CURSO = URL_HORARIOS + 'getHorariosPorCurso/';

export const OBTENER_CURSOS_MATRICULADOS = URL_CURSOS_MATRICULADOS + 'getCursosMatriculados/';
export const OBTENER_UN_CURSO_MATRICULADO = URL_CURSOS_MATRICULADOS + 'getCursoMatriculado/';
export const INSERTAR_CURSO_MATRICULADO = URL_CURSOS_MATRICULADOS + 'insertCursoMatriculado';
export const ACTUALIZAR_CURSO_MATRICULADO = URL_CURSOS_MATRICULADOS + 'updateCursoMatriculado/';
export const ELIMINAR_CURSO_MATRICULADO = URL_CURSOS_MATRICULADOS + 'deleteCursoMatriculado/';
export const OBTENER_AUSENCIAS = URL_CURSOS_MATRICULADOS + 'getAusencias/';
export const AGREGAR_NOTA = URL_CURSOS_MATRICULADOS + 'agregarNota/';
export const AGREGAR_AUSENCIAS = URL_CURSOS_MATRICULADOS + 'updateAusencias/';


export const OBTENER_CURSOS_HISTORICOS = URL_CURSOS_HISTORICOS + 'getCursosHistoricos/';
export const OBTENER_UN_CURSO_HISTORICO = URL_CURSOS_HISTORICOS + 'getCursoHistorico/';
export const INSERTAR_CURSO_HISTORICO = URL_CURSOS_HISTORICOS + 'insertCursoHistorico/';
export const ACTUALIZAR_CURSO_HISTORICO = URL_CURSOS_HISTORICOS + 'updateCursoHistorico/';
export const ELIMINAR_CURSO_HISTORICO = URL_CURSOS_HISTORICOS + 'deleteCursoHistorico/';

