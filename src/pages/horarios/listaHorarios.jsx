import React, { useEffect, useState, useMemo } from 'react';
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerHorarios, eliminarHorario } from '../../services/horariosServices';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../../components/navbar/navbar';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ListaHorarios() {
    const [rows, setRows] = useState([]);
    const [filterText, setFilterText] = useState('');

    const fetchHorarios = async () => {
        try {
            const data = await obtenerHorarios();
            const horariosConId = data.map((item, index) => ({
                ...item,
                id: item.id || index,

            }));
            setRows(horariosConId);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al obtener horarios",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    useEffect(() => {
        fetchHorarios();
    }, []);

    const handleEliminar = async (id, data) => {
        // const confirm = window.confirm('¿Estás seguro de que deseas eliminar este horario?');
        // if (!confirm) return;
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el horario:  ${data.curso} - ${data.profesor} - ${data.dia} - ${data.horaInicio} - ${data.horaFin}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            eliminarHorario(id)
                .then(async (response) => {
                    if (response.success) {
                        await Swal.fire({
                            icon: "success",
                            title: response.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        fetchHorarios();

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
                        title: "Error al eliminar el horario",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        }
    };

    const filteredRows = useMemo(() => {
        const normalizedFilter = filterText.toLowerCase();
        return rows.filter(row =>
            [row.curso, row.profesor, row.dia, row.horaInicio, row.horaFin, row.ciclo]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Horarios');
        XLSX.writeFile(workbook, 'horarios.xlsx');
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.text('Lista de Horarios', 14, 10);

        autoTable(doc, {
            head: [['Curso', 'Profesor', 'Dia', 'Hora Inicio', 'Hora Fin', 'Ciclo']],
            body: filteredRows.map(row => [
                row.curso,
                row.profesor,
                row.dia,
                row.horaInico,
                row.horaFin,
                row.ciclo,
            ]),
            startY: 20,
        });

        doc.save('horarios.pdf');
    };

    const columns = [
        { name: 'Curso', selector: row => row.curso, sortable: true, wrap: true, minWidth: '150px' },
        { name: 'Profesor', selector: row => row.profesor, sortable: true, wrap: true, minWidth: '150px' },
        { name: 'Día', selector: row => row.dia, sortable: true, wrap: true, minWidth: '100px' },
        { name: 'Hora Inicio', selector: row => row.horaInicio, wrap: true, minWidth: '130px' },
        { name: 'Hora Fin', selector: row => row.horaFin, wrap: true, minWidth: '120px' },
        { name: 'Ciclo', selector: row => row.ciclo, wrap: true, minWidth: '130px' },
        {
            name: 'Acciones', minWidth: '300px',
            cell: row => (
                <div className='flex flex-row gap-2 '>
                    <Link to={`/horarios/registro?id=${row.id}`}>
                        <Button size="small" variant="contained" color="warning" startIcon={<EditIcon />}>Actualizar</Button>
                    </Link>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleEliminar(row.id, row)}
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
            <Box sx={{ padding: 2 }} className='z-0'>

                <div className='w-fit m-auto'>
                    <Stack sx={{ mb: 2 }}>
                        <label className='text-4xl font-bold'>Lista de Horarios</label>
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
                            responsive={false}
                            noDataComponent="No se encontraron horarios"
                            customStyles={customStyles}
                        />
                    </Box>
                </div>


            </Box>
        </>
    );
}

