import { useEffect, useState, useMemo } from 'react';
import { Button, Stack, Box, TextField } from '@mui/material';
import { obtenerCursosHistoricos } from '../../services/cursosHistoricosServices';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { exportarHistoricosExcel, exportarHistoricosPDF } from '../../services/exportarTablas';

export default function ListaEstudianteCursosHistoricos({ id, estudiante, actualizarTrigger  }) {

    
    const [rows, setRows] = useState([]);
    const [filterText, setFilterText] = useState('');


    const fetchCursosHistoricos = async (id) => { // Recibir id como parámetro

        obtenerCursosHistoricos(id)
            .then((data) => {
                const cursosHistoricos = data.map((item, index) => ({
                    ...item,
                    id: item.id || index,
                }));
                setRows(cursosHistoricos);
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error al obtener la informacion de los cursos historicos",
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };

    useEffect(() => {
        if (id) {
            fetchCursosHistoricos(id); // Llamada correcta con id
        }
    }, [id, actualizarTrigger]);

    const filteredRows = useMemo(() => {
        const normalizedFilter = filterText.toLowerCase();
        return rows.filter(row =>
            [row.curso, row.ciclo, row.nota, row.estado]
                .some(val => (val || '').toLowerCase().includes(normalizedFilter))
        );
    }, [rows, filterText]);


    const columns = [
        { name: 'Curso', selector: row => row.curso, sortable: true, wrap: true, minWidth: '110px' },
        { name: 'Ciclo', selector: row => row.ciclo, sortable: true, wrap: true, minWidth: '130px' },
        { name: 'Calificación', selector: row => row.nota, wrap: true, minWidth: '150px' },
        { name: 'Estado', selector: row => row.estado, wrap: true, minWidth: '130px' },
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
                <div className='w-fit m-auto'>
                    <Stack sx={{ mb: 2 }}>
                        <label className='text-4xl font-bold'>Lista de Cursos Históricos</label>
                    </Stack>

                    <div className='flex flex-col sm:flex-row gap-5 mb-5'>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <Button variant="contained" color="success" onClick={() => exportarHistoricosExcel(estudiante, rows)}>
                            Exportar a Excel
                        </Button>
                        <Button variant="contained" color="error" onClick={() => exportarHistoricosPDF(estudiante, rows)}>
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

