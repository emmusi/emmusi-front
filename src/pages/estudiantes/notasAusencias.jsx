import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerUnEstudiante } from '../../services/estudianteServices';
import { obtenerAusencias, agregarNota, agregarAusencias } from '../../services/cursosMatriculadosServices';
import { exportarNotasAusenciasExcel  , exportarNotasAusenciasPDF } from '../../services/exportarTablas'; 
import Navbar from '../../components/navbar/navbar';
import DataTable from 'react-data-table-component';
import NotesIcon from '@mui/icons-material/Notes';
import SchoolIcon from '@mui/icons-material/School';
import Swal from 'sweetalert2'


export default function NotasAusencias() {
    const [rows, setRows] = useState([]);
    const [estudiante, setEstudiante] = useState({
        id: "",
        cedula: "",
        nombre: "",
        telefono: "",
        especialidad: "",
        subespecialidad: "",
    });
    const [filterText, setFilterText] = useState('');
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const fetchAusencias = async (id) => { // Recibir id como parámetro
        try {
            const data = await obtenerAusencias(id); // Pasar id a la función de consulta
            const ausencias = data.map((item, index) => ({
                ...item,
                id: item.id || index,
            }));
            setRows(ausencias);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: 'Error al obtener los cursos matriculados.',
                showConfirmButton: false,
                timer: 1500
            });

        }
    };

    useEffect(() => {
        if (id) {
            fetchAusencias(id); // Llamada correcta con id
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
                        title: 'No se pudo obtener la informacion del estudiante.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        }
    }, [id]);

    const filteredRows = useMemo(() => {
        const normalizedFilter = filterText.toLowerCase();
        return rows.filter(row =>
            [row.curso, row.horario, row.profesor]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);

    const obtenerNota = async (idCursoMatriculado) => {
        const { value: nota, isConfirmed } = await Swal.fire({
            title: 'Ingresar Nota',
            input: 'text',
            inputPlaceholder: "Ej: 95, Retiro Justificado, No Oferta",
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value || value.trim() === "") {
                    return "Este campo no puede estar vacío.";
                }

                const notaLimpia = value.trim();
                const frasesValidas = ["Retiro Justificado", "No Oferta"];
                const esNumeroValido = !isNaN(notaLimpia) && Number(notaLimpia) >= 0 && Number(notaLimpia) <= 100;
                const esFraseValida = frasesValidas.some(f => f.toLowerCase() === notaLimpia.toLowerCase());

                if (!esNumeroValido && !esFraseValida) {
                    return "Ingresa un número entre 0 y 100 o una frase válida: 'Retiro Justificado', 'No Oferta'";
                }

                return null;
            }
        });

        if (isConfirmed && nota) {
            const notaLimpia = nota.trim();
            agregarNota(idCursoMatriculado, notaLimpia)
                .then((response) => {

                    if (response.success) {
                        fetchAusencias(id);
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
                        title: 'No se pudo guardar la nota.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        }


    };

    const insertarAusencias = async (idCursoMatriculado, curJustificadas, curInjustificadas) => {
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Agregar Ausencias',
            html:
                '<input id="justificadas" type="number" min="0" class="swal2-input" placeholder="Justificadas">' +
                '<input id="injustificadas" type="number" min="0" class="swal2-input" placeholder="Injustificadas">',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => {
                const justificadas = document.getElementById('justificadas').value;
                const injustificadas = document.getElementById('injustificadas').value;

                if (justificadas === '' && injustificadas === '') {
                    Swal.showValidationMessage('Debes ingresar al menos un campo');
                    return;
                }

                if (
                    (justificadas !== '' && (isNaN(justificadas) || justificadas < 0)) ||
                    (injustificadas !== '' && (isNaN(injustificadas) || injustificadas < 0))
                ) {
                    Swal.showValidationMessage('Solo se permiten números positivos');
                    return;
                }

                return {
                    justificadas: justificadas !== '' ? Number(justificadas) : null,
                    injustificadas: injustificadas !== '' ? Number(injustificadas) : null
                };
            }
        });

        if (isConfirmed && formValues) {

            try {
                let finalJustifiadas = curJustificadas;
                let finalInjustificadas = curInjustificadas;

                if (formValues.justificadas !== null) {
                    finalJustifiadas = formValues.justificadas;
                }
                if (formValues.injustificadas !== null) {
                    finalInjustificadas = formValues.injustificadas;

                }

                agregarAusencias(idCursoMatriculado, finalJustifiadas, finalInjustificadas).then((response) => {

                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchAusencias(id);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: 'No se pudo guardar las ausencias.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                })

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: 'No se pudo guardar las ausencias.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };


    const columns = [
        { name: 'Curso', selector: row => row.curso, sortable: true, wrap: true, minWidth: '110px' },
        { name: 'Calificación', selector: row => row.nota, sortable: true, wrap: true, minWidth: '150px' },
        { name: 'Justificadas', selector: row => row.justificadas, wrap: true, minWidth: '140px' },
        { name: 'Injustificadas', selector: row => row.injustificadas, wrap: true, minWidth: '160px' },
        {
            name: 'Acciones', minWidth: '380px',
            cell: row => (
                <div className='flex flex-row gap-2'>
                    <Button size="small" variant="outlined" onClick={() => insertarAusencias(row.id, row.justificadas, row.injustificadas)} startIcon={<SchoolIcon />}>
                        Agregar Ausencias
                    </Button>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => obtenerNota(row.id)} startIcon={<NotesIcon />}>Agregar Nota</Button>
                </div>
            ),
        }
    ];


    const customStyles = {
        headCells: {
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#f1b282', // Cambia esto al color de fondo que quieras
            },
        },
        cells: {
            style: {
                fontSize: '16px',
            },
        },
    };

    

    return (
        <>
            <Navbar />
            <Box sx={{ padding: 2 }} className='z-0 '>

                <div className="flex flex-row gap-96 w-fit m-auto my-5">
                    <div className=''>
                        <p className="font-medium text-lg ">Cédula: {estudiante.cedula}</p>
                        <p className="font-medium text-lg ">Estudiante: {estudiante.nombre}</p>
                        <p className="font-medium text-lg ">Subespecialidad: {estudiante.subespecialidad}</p>
                    </div>
                    <div className='bg-anaranjado-cuadro px-10 border-2 border-black'>
                        <p className="font-medium text-lg ">Matricula: {rows[0]?.ciclo}</p>
                        <p className="font-medium text-lg ">Especialidad: {estudiante.especialidad}</p>
                    </div>
                </div>

                <div className='w-fit m-auto'>
                    <Stack sx={{ mb: 2 }}>
                        <label className='text-4xl font-bold'>Lista de Notas y Ausencias</label>
                    </Stack>

                    <div className='flex flex-col sm:flex-row gap-5 mb-5'>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <Button variant="contained" color="success" onClick={() => exportarNotasAusenciasExcel(estudiante, rows)}>
                            Exportar a Excel
                        </Button>
                        <Button variant="contained" color="error" onClick={() => exportarNotasAusenciasPDF(estudiante, rows)}>
                            Exportar a PDF
                        </Button>
                    </div>
                </div>



                <div className="overflow-auto">
                    <Box sx={{ overflowX: 'auto' }} className="w-fit m-auto">
                        <DataTable
                            columns={columns}
                            data={filteredRows}
                            pagination
                            fixedHeader
                            highlightOnHover
                            striped
                            responsive={true}
                            noDataComponent="No se encontraron horarios"
                            customStyles={customStyles}
                        />
                    </Box>
                </div>


            </Box>
        </>
    );
}

