import React, { useEffect, useState, useMemo } from 'react';
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerProfesores, eliminarProfesor } from '../../services/profesoresServices';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../../components/navbar/navbar';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ListaEstudiantes() {
    const [rows, setRows] = useState([]);
    const [filterText, setFilterText] = useState('');

    const fetchProfesores = async () => {
        try {
            const data = await obtenerProfesores();
            const horariosConId = data.map((item, index) => ({
                ...item,
                id: item.id || index,
            }));
            setRows(horariosConId);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al obtener cursos",
                showConfirmButton: false,
                timer: 1500
            });

        }
    };

    useEffect(() => {
        fetchProfesores();
    }, []);

    const handleEliminar = async (id, nombre) => {
        const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas eliminar el Profesor:  ${nombre}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'No',
                    reverseButtons: true,
                });
                
                if (result.isConfirmed) {
                    eliminarProfesor(id)
                        .then(async (response) => {
                            if (response.success) {
                                await Swal.fire({
                                    icon: "success",
                                    title: response.message,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                fetchProfesores();
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
            [row.nombre]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Profesores');
        XLSX.writeFile(workbook, 'profesores.xlsx');
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.text('Lista de Profesores', 14, 10);

        autoTable(doc, {
            head: [['Nombre',]],
            body: filteredRows.map(row => [
                row.nombre,
            ]),
            startY: 20,
        });

        doc.save('profesores.pdf');
    };

    const columns = [
        { name: 'Nombre', selector: row => row.nombre, sortable: true, wrap: true, minWidth: '150px' },
        {
            name: 'Acciones', minWidth: '300px',
            cell: row => (
                <div className='flex flex-row gap-2 '>
                    <Link to={`/formsProfesoresCursos/registro?tipo=profesor&id=${row.id}`}>
                        <Button size="small" variant="contained" color="warning" startIcon={<EditIcon />}>Actualizar</Button>
                    </Link>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleEliminar(row.id)}
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
                fontSize: '18px', // Tamaño de texto para encabezados
                fontWeight: 'bold',
            },
        },
        cells: {
            style: {
                fontSize: '16px', // Tamaño de texto para celdas
            },
        },
    };

    return (
        <>
            <Navbar />
            <Box sx={{ padding: 2 }} className='z-0 '>

                <div className='w-fit m-auto'>
                    <Stack sx={{ mb: 2 }}>
                        <label className='text-4xl font-bold '>
                            Lista de Profesores
                        </label>
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



                <div className="overflow-auto ">
                    <Box sx={{ overflowX: 'auto' }} className="w-fit m-auto">
                        <DataTable
                            columns={columns}
                            data={filteredRows}
                            pagination
                            fixedHeader
                            highlightOnHover
                            striped
                            responsive={false}
                            noDataComponent="No se encontraron cursos"
                            customStyles={customStyles}
                        />
                    </Box>
                </div>


            </Box>
        </>
    );
}



