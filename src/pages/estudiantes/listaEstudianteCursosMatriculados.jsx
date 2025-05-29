import { useEffect, useState, useMemo } from 'react';
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerCursosMatriculados, eliminarCursoMatriculado } from '../../services/cursosMatriculadosServices';
import { insertarCursoHistorico } from '../../services/cursosHistoricosServices';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import { exportarMatriculadosExcel, exportarMatriculadosPDF } from '../../services/exportarTablas';

export default function ListaEstudianteCursosMatriculados({ id, estudiante, onCursoPasadoAHistorico }) {
    const [rows, setRows] = useState([]);
    const [filterText, setFilterText] = useState('');

    const fetchCursosMatriculados = async (id) => { // Recibir id como parámetro

        obtenerCursosMatriculados(id)
            .then((data) => {
                const cursosMatriculados = data.map((item, index) => ({
                    ...item,
                    id: item.id || index,
                }));
                setRows(cursosMatriculados);
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error al obtener la informacion de los cursos matriculados",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };

    useEffect(() => {
        if (id) {
            fetchCursosMatriculados(id); // Llamada correcta con id
        }
    }, [id]);

    const handleEliminar = async (idCursoMatriculado, curso) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la matricula de este curso: ${curso}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            eliminarCursoMatriculado(idCursoMatriculado)
                .then(async (response) => {
                    if (response.success) {
                        await Swal.fire({
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchCursosMatriculados(id);
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
                        title: "Error al eliminar el curso matriculado",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        }

    };

    const pasarHistorico = async (idCursoMatriculado, curso) => {

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas pasar a historico el curso: ${curso}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'No',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            insertarCursoHistorico(idCursoMatriculado).then(async (response) => {

                if (response.success) {
                    await Swal.fire({
                        icon: "success",
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchCursosMatriculados(id);

                    onCursoPasadoAHistorico?.();

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
                    title: "Error al mover a historico",
                    showConfirmButton: false,
                    timer: 1500
                });
            })

        }
    }

    const filteredRows = useMemo(() => {
        const normalizedFilter = filterText.toLowerCase();
        return rows.filter(row =>
            [row.curso, row.horario, row.profesor]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);


    const columns = [
        { name: 'Curso', selector: row => row.curso, sortable: true, wrap: true, minWidth: '110px' },
        { name: 'Horario', selector: row => row.horario, sortable: true, wrap: true, minWidth: '300px' },
        { name: 'Profesor', selector: row => row.profesor, wrap: true, minWidth: '100px' },
        {
            name: 'Acciones', minWidth: '350px',
            cell: row => (
                <div className='flex flex-row gap-2'>
                    <Button size="small" variant="outlined" onClick={() => pasarHistorico(row.id, row.curso)} startIcon={<SchoolIcon />}>
                        Pasar a Historico
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleEliminar(row.id, row.curso)}
                        startIcon={<DeleteIcon />}
                    >
                        Eliminar
                    </Button>
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
            <Box sx={{ padding: 2 }} className='z-0 '>

                <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 lg:gap-60 w-fit m-auto my-5">
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
                        <label className='text-4xl font-bold'>Lista de Cursos Matriculados</label>
                    </Stack>

                    <div className='flex flex-col sm:flex-row gap-5 mb-5'>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <Button variant="contained" color="success" onClick={() => exportarMatriculadosExcel(estudiante, rows)}>
                            Exportar a Excel
                        </Button>
                        <Button variant="contained" color="error" onClick={() => exportarMatriculadosPDF(estudiante, rows)}>
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

