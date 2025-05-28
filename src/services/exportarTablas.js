import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/images/logo emmusi.jpg'; // Ajusta según tu estructura

// 🎯 Función genérica para exportar a Excel
export async function exportarMatriculadosExcel(estudiante, rows) {
  const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Cursos Matriculados');

        // 🔽 Insertar dos filas vacías antes de todo
        sheet.addRow([]);
        sheet.addRow([]);

        // 🔶 Cuadro de matrícula (ahora en D3 y D4)
        sheet.getCell('D3').value = `MATRÍCULA ${rows[0]?.ciclo || ''}`;
        sheet.getCell('D3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D3').font = { bold: true };
        sheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };

        sheet.getCell('D4').value = `ESPECIALIDAD ${estudiante.especialidad || ''}`;
        sheet.getCell('D4').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D4').font = { bold: true };
        sheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };

        // 🧑 Datos del estudiante (ahora en C5 y C6)
        sheet.getCell('C3').value = `Estudiante: ${estudiante.nombre}`;
        sheet.getCell('C4').value = `Subespecialidad: ${estudiante.subespecialidad}`;

        // 🟧 Insertamos dos filas vacías antes de la tabla para moverla a C9
        sheet.addRow([]);
        sheet.addRow([]);

        // 🟧 Encabezado de la tabla (ahora en la fila 9)
        const header = ['', '', 'Curso', 'Horario', 'Profesor'];
        const headerRow = sheet.addRow(header);
        headerRow.eachCell((cell, colNumber) => {
            if (colNumber >= 3) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9966' },
                };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = { horizontal: 'center' };
            }
        });

        // 📄 Filas de datos (también desplazadas)
        rows.forEach((row) => {
            const dataRow = sheet.addRow(['', '', row.curso, row.horario, row.profesor]);
            dataRow.eachCell((cell, colNumber) => {
                if (colNumber >= 3) {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        });

        // 📏 Ajustar ancho de columnas
        sheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, value.length);
            });
            column.width = maxLength + 4;
        });

        // 💾 Guardar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${estudiante.nombre} Cursos Matriculados.xlsx`);
}

export async function exportarMatriculadosPDF(estudiante, rows) {
      const doc = new jsPDF();

        // 👇 Dibuja los logos
        const drawLogos = (startY) => {
            const imgWidth = 40;
            const imgHeight = 15;
            doc.addImage(logo, 'PNG', 10, startY, imgWidth, imgHeight);
            doc.addImage(logo, 'PNG', 60, startY, imgWidth, imgHeight);
            doc.addImage(logo, 'PNG', 110, startY, imgWidth, imgHeight);
        };

        // 👇 Dibuja el recuadro de matrícula a la derecha
        const drawCuadroMatricula = (startY) => {
            doc.setDrawColor(0);
            doc.setFillColor(255, 153, 102);
            doc.rect(130, startY, 66, 20, 'FD');
            doc.setFontSize(15);
            doc.setTextColor(0);
            doc.text(`MATRÍCULA ${rows[0]?.ciclo || ''}`, 135, startY + 7);
            doc.text(`Especialidad: ${estudiante.especialidad}`, 133, startY + 14);
        };

        // 👇 Dibuja los datos del estudiante
        const drawDatosEstudiante = (startY) => {
            doc.setFontSize(13);
            doc.setTextColor(0);
            doc.text(`Estudiante: ${estudiante.nombre}`, 14, startY + 7);
            doc.text(`Subespecialidad: ${estudiante.subespecialidad}`, 14, startY + 14);
        };

        // 👇 Dibuja la tabla de cursos
        const drawTabla = (startY) => {
            autoTable(doc, {
                startY,
                head: [['Curso', 'Horario', 'Profesor']],
                body: rows.map(row => [
                    row.curso,
                    row.horario,
                    row.profesor,
                ]),
                styles: {
                    fontSize: 10,
                    textColor: [0, 0, 0],
                    halign: 'center',
                    valign: 'middle',
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                headStyles: {
                    fillColor: [255, 153, 102],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                },
            });

        };

        // 👇 Función principal para ensamblar un bloque completo

        drawLogos(10);
        drawCuadroMatricula(30); // se mantiene arriba a la derecha
        drawDatosEstudiante(30);
        drawTabla(70);


        doc.save(`${estudiante.nombre} Cursos Matriculados.pdf`);
}

// ------------------------------------------------Historicos---------------------------------------------------------------------

export async function exportarHistoricosExcel(estudiante, rows) {
            const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Cursos Históricos');

        // 🔽 Insertar dos filas vacías antes de todo
        sheet.addRow([]);
        sheet.addRow([]);

        // 🔶 Cuadro de matrícula (ahora en D3 y D4)
        sheet.getCell('D3').value = `ESPECIALIDAD ${estudiante.especialidad || ''}`;
        sheet.getCell('D3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D3').font = { bold: true };
        sheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };

        // sheet.getCell('D4').value = `ESPECIALIDAD ${estudiante.especialidad || ''}`;
        sheet.getCell('D4').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D4').font = { bold: true };
        sheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };

        // 🧑 Datos del estudiante (ahora en C5 y C6)
        sheet.getCell('C3').value = `Estudiante: ${estudiante.nombre}`;
        sheet.getCell('C4').value = `Subespecialidad: ${estudiante.subespecialidad}`;

        // 🟧 Insertamos dos filas vacías antes de la tabla para moverla a C9
        sheet.addRow([]);
        sheet.addRow([]);

        // 🟧 Encabezado de la tabla (ahora en la fila 9)
        const header = ['', '', 'Curso', 'Ciclo', 'Calificación', 'Estado'];
        const headerRow = sheet.addRow(header);
        headerRow.eachCell((cell, colNumber) => {
            if (colNumber >= 3) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9966' },
                };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = { horizontal: 'center' };
            }
        });

        // 📄 Filas de datos (también desplazadas)
        rows.forEach((row) => {
            const dataRow = sheet.addRow(['', '', row.curso, row.ciclo, row.nota, row.estado]);
            dataRow.eachCell((cell, colNumber) => {
                if (colNumber >= 3) {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        });

        // 📏 Ajustar ancho de columnas
        sheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, value.length);
            });
            column.width = maxLength + 4;
        });

        // 💾 Guardar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${estudiante.nombre} Cursos Historicos.xlsx`);
    
}

export async function exportarHistoricosPDF(estudiante, rows) {
    const doc = new jsPDF();
    
            // 👇 Dibuja los logos
            const drawLogos = (startY) => {
                const imgWidth = 40;
                const imgHeight = 15;
                doc.addImage(logo, 'PNG', 10, startY, imgWidth, imgHeight);
                doc.addImage(logo, 'PNG', 60, startY, imgWidth, imgHeight);
                doc.addImage(logo, 'PNG', 110, startY, imgWidth, imgHeight);
            };
    
            // 👇 Dibuja el recuadro de matrícula a la derecha
            const drawCuadroMatricula = (startY) => {
                doc.setDrawColor(0);
                doc.setFillColor(255, 153, 102);
                doc.rect(130, startY, 66, 20, 'FD');
                doc.setFontSize(15);
                doc.setTextColor(0);
                // doc.text(`MATRÍCULA ${rows[0]?.ciclo || ''}`, 135, startY + 7);
                doc.text(`Especialidad: ${estudiante.especialidad}`, 133, startY + 10);
            };
    
            // 👇 Dibuja los datos del estudiante
            const drawDatosEstudiante = (startY) => {
                doc.setFontSize(13);
                doc.setTextColor(0);
                doc.text(`Estudiante: ${estudiante.nombre}`, 14, startY + 7);
                doc.text(`Subespecialidad: ${estudiante.subespecialidad}`, 14, startY + 14);
            };
    
            // 👇 Dibuja la tabla de cursos
            const drawTabla = (startY) => {
                autoTable(doc, {
                    startY,
                    head: [['Curso', 'Ciclo', 'Calificacion', 'Estado']],
                    body: rows.map(row => [
                        row.curso,
                        row.ciclo,
                        row.nota,
                        row.estado
                    ]),
                    styles: {
                        fontSize: 10,
                        textColor: [0, 0, 0],
                        halign: 'center',
                        valign: 'middle',
                        lineWidth: 0.1,
                        lineColor: [0, 0, 0],
                    },
                    headStyles: {
                        fillColor: [255, 153, 102],
                        textColor: [0, 0, 0],
                        fontStyle: 'bold',
                    },
                });
    
            };
    
            // 👇 Función principal para ensamblar un bloque completo
    
            drawLogos(10);
            drawCuadroMatricula(30); // se mantiene arriba a la derecha
            drawDatosEstudiante(30);
            drawTabla(70);
    
    
            doc.save(`${estudiante.nombre} Cursos Historicos.pdf`);
}

// ------------------------------------------------Notas Ausencias---------------------------------------------------------------------
export async function exportarNotasAusenciasExcel (estudiante, rows) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Ausencias');

        // 🔽 Insertar dos filas vacías antes de todo
        sheet.addRow([]);
        sheet.addRow([]);

        // 🔶 Cuadro de matrícula (ahora en D3 y D4)
        sheet.getCell('D3').value = `CURSO LECTIVO ${rows[0]?.ciclo || ''}`;
        sheet.getCell('D3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D3').font = { bold: true };
        sheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };

        sheet.getCell('D4').value = `ESPECIALIDAD ${estudiante.especialidad || ''}`;
        sheet.getCell('D4').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF9966' },
        };
        sheet.getCell('D4').font = { bold: true };
        sheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' };

        // 🧑 Datos del estudiante (ahora en C5 y C6)
        sheet.getCell('C3').value = `Estudiante: ${estudiante.nombre}`;
        sheet.getCell('C4').value = `Subespecialidad: ${estudiante.subespecialidad}`;

        // 🟧 Insertamos dos filas vacías antes de la tabla para moverla a C9
        sheet.addRow([]);
        sheet.addRow([]);

        // 🟧 Encabezado de la tabla (ahora en la fila 9)
        const header = ['', '', 'Curso', 'Calificación', 'Ausencias Justificadas', 'Ausencias Injustificadas'];
        const headerRow = sheet.addRow(header);
        headerRow.eachCell((cell, colNumber) => {
            if (colNumber >= 3) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF9966' },
                };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = { horizontal: 'center' };
            }
        });

        // 📄 Filas de datos (también desplazadas)
        rows.forEach((row) => {
            const dataRow = sheet.addRow(['', '', row.curso, row.nota, row.justificadas, row.injustificadas]);
            dataRow.eachCell((cell, colNumber) => {
                if (colNumber >= 3) {
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        });

        // 📏 Ajustar ancho de columnas
        sheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, value.length);
            });
            column.width = maxLength + 4;
        });

        // 💾 Guardar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${estudiante.nombre} notas y ausencias.xlsx`);
    };


    // --------------------------------------------**************************************************--------------------------------------------------------------------
    export async function exportarNotasAusenciasPDF(estudiante, rows) {
        const doc = new jsPDF();

        // 👇 Dibuja los logos
        const drawLogos = (startY) => {
            const imgWidth = 40;
            const imgHeight = 15;
            doc.addImage(logo, 'PNG', 10, startY, imgWidth, imgHeight);
            doc.addImage(logo, 'PNG', 60, startY, imgWidth, imgHeight);
            doc.addImage(logo, 'PNG', 110, startY, imgWidth, imgHeight);
        };

        // 👇 Dibuja el recuadro de matrícula a la derecha
        const drawCuadroMatricula = (startY) => {
            doc.setDrawColor(0);
            doc.setFillColor(255, 153, 102);
            doc.rect(130, startY, 66, 20, 'FD');
            doc.setFontSize(15);
            doc.setTextColor(0);
            doc.text(`MATRÍCULA ${rows[0]?.ciclo || ''}`, 135, startY + 7);
            doc.text(`Especialidad: ${estudiante.especialidad}`, 133, startY + 14);
        };

        // 👇 Dibuja los datos del estudiante
        const drawDatosEstudiante = (startY) => {
            doc.setFontSize(13);
            doc.setTextColor(0);
            doc.text(`Estudiante: ${estudiante.nombre}`, 14, startY + 7);
            doc.text(`Subespecialidad: ${estudiante.subespecialidad}`, 14, startY + 14);
        };

        // 👇 Dibuja la tabla de cursos
        const drawTabla = (startY) => {
            autoTable(doc, {
                startY,
                head: [['Curso', 'Calificación', 'Ausencias Justificadas', 'Ausencias Injustificadas']],
                body: rows.map(row => [
                    row.curso,
                    row.nota,
                    row.justificadas,
                    row.injustificadas
                ]),
                styles: {
                    fontSize: 10,
                    textColor: [0, 0, 0],
                    halign: 'center',
                    valign: 'middle',
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                headStyles: {
                    fillColor: [255, 153, 102],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                },
            });

        };

        // 👇 Función principal para ensamblar un bloque completo

        drawLogos(10);
        drawCuadroMatricula(30); // se mantiene arriba a la derecha
        drawDatosEstudiante(30);
        drawTabla(70);


        doc.save(`${estudiante.nombre} notas y ausencias.pdf`);
    };
