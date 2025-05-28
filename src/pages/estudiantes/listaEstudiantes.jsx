import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerEstudiantes, eliminarEstudiante } from '../../services/estudianteServices';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../../components/navbar/navbar';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import NotesIcon from '@mui/icons-material/Notes';
import ListIcon from '@mui/icons-material/ListAlt';

export default function ListaEstudiantes() {
    const [rows, setRows] = useState([]);
    const [filterText, setFilterText] = useState('');

    const fetchEstudiantes = async () => {
        
        obtenerEstudiantes()
              .then((data) => {
                 const estudiantesConId = data.map((item, index) => ({
                ...item,
                id: item.id || index,
            }));
            setRows(estudiantesConId);
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Error al obtener la informacion de los estudiante",
                  showConfirmButton: false,
                  timer: 1500
                });
              });
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const handleEliminar = async (id, cedNomb) => {

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar al estudiante: ${cedNomb.cedula} - ${cedNomb.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            eliminarEstudiante(id)
                .then(async(response) => {
                    if (response.success) {
                      await  Swal.fire({
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchEstudiantes();
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
                        title: "Error al registrar el estudiante",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        }



    };

    const filteredRows = useMemo(() => {
        const normalizedFilter = filterText.toLowerCase();
        return rows.filter(row =>
            [row.cedula, row.nombre, row.telefono, row.especialidad, row.subespecialidad]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');
        XLSX.writeFile(workbook, 'estudiantes.xlsx');
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.text('Lista de Estudiantes', 14, 10);

        autoTable(doc, {
            head: [['Cedula', 'Nombre', 'Teléfono', 'Especialidad', 'Subespecialidad']],
            body: filteredRows.map(row => [
                row.cedula,
                row.nombre,
                row.telefono,
                row.especialidad,
                row.subespecialidad,
            ]),
            startY: 20,
        });

        doc.save('estudiantes.pdf');
    };

    const columns = [
        { name: 'Cedula', selector: row => row.cedula, sortable: true, wrap: true, minWidth: '110px' },
        { name: 'Nombre', selector: row => row.nombre, sortable: true, wrap: true, minWidth: '200px' },
        { name: 'Telefono', selector: row => row.telefono, wrap: true, minWidth: '100px' },
        { name: 'Especialidad', selector: row => row.especialidad, wrap: true, minWidth: '140px' },
        { name: 'Subespecialidad', selector: row => row.subespecialidad, wrap: true, minWidth: '170px' },
        {
            name: 'Acciones', minWidth: '730px',
            cell: row => (
                <div className='flex flex-row gap-2'>
                    <Link to={`/estudiantes/matricularEstudiante?id=${row.id}`}>
                        <Button size="small" variant="outlined" startIcon={<SchoolIcon />}>Matricular</Button>
                    </Link>
                    <Link to={`/estudiantes/notasAusencias?id=${row.id}`}>
                        <Button size="small" variant="outlined" color="secondary" startIcon={<NotesIcon />}>Notas/Ausencias</Button>
                    </Link>
                    <Link to={`/estudiantes/listaEstudianteCursos?id=${row.id}`}>
                        <Button size="small" variant="outlined" color="info" startIcon={<ListIcon />}>Cursos</Button>
                    </Link>
                    <Link to={`/estudiantes/registro?id=${row.id}`}>
                        <Button size="small" variant="contained" color="warning" startIcon={<EditIcon />}>Actualizar</Button>
                    </Link>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleEliminar(row.id, { cedula: row.cedula, nombre: row.nombre })}
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
            <Box sx={{ padding: 2 }} className='z-0'>

                <div className='w-fit m-auto'>
                    <Stack sx={{ mb: 2 }}>
                        <label className='text-4xl font-bold'>Lista de Estudiantes</label>
                    </Stack>

                    <div className='flex flex-col sm:flex-row gap-5 mb-5'>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <Button variant="contained" color="success" onClick={exportExcel}>
                            Exportar a Excel
                        </Button>
                        <Button variant="contained" color="error" onClick={exportPDF}>
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

